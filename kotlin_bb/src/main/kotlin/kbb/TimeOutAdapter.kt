package kbb

import java.util.concurrent.*
import java.util.function.Function

class TimeOutAdapter <I,R> (private  val function: Function<I, R>, var timeOut : Long): Function<I, R> {

    override fun apply(input: I): R {

        val callable = Callable<R> { function.apply(input) }
        val executor = Executors.newScheduledThreadPool(1)
        val futures = executor.invokeAll( listOf( callable ) , timeOut, TimeUnit.MILLISECONDS )

        try {
            return futures[0].get(timeOut, TimeUnit.MILLISECONDS)
        } catch (ee : ExecutionException ){
            throw ee.cause!!
        } catch ( ce : CancellationException ){
            throw TimeoutException("Execution did not complete within $timeOut ms!")
        } finally {
            executor.shutdown()
        }
    }
}

object F {
    fun verify(input: String): String {
        println(input)
        Thread.sleep(1000)
        return "OK"
    }
}


fun main(args: Array<String>) {

    var input: String = ""
    // Function is an interface, implement the interface by invoking the desired function in the lambda
    // input type is String (corresponding to <I>) and return type is String (corresponding to <R>)
    val canTimeout = Function<String,String> { t ->
        val result = F.verify(input)
        result
    }

    // now we wrap that function using our timeout adaptor
    val timeOutAdaptor = TimeOutAdapter(canTimeout, 5000)
    input = "Hello!"
    val result = timeOutAdaptor.apply(input)
    println(result)
}
