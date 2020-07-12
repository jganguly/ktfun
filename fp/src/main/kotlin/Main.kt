import TC.Value
import kotlinx.coroutines.*

fun testMonad() {
    /** Input type DC is wrapped in type class TC
     */
//    var inp: TC<DC>

    /** Functions take a value dc of type DC and
     *  and return a wrapped value of type class TC
     */
    var listOfFunctions: List<(DC) -> TC<DC>> = mutableListOf()
    listOfFunctions += ::mysqrt
    listOfFunctions += ::mylog
    listOfFunctions += ::myinv

    var dc = DC(100.0,"Start\n")
    println(dc)
//    dc.data = 100.0
//    dc.rem = "Start\n"
    var inp: TC<DC> = TC.Value(dc)
    println(inp)

//    println(inp.value.data)
//    println(inp.value.rem)

    inp = execute(inp, listOfFunctions) as TC.Value<DC>
    println(inp)

    println(inp.value.data)
    println(inp.value.rem)
    println()

//    dc = DC(100.0,"Start")
//    inp = TC.Value(dc)
//    println(inp.value.data)
//    println(inp.value.rem)
//
//    var out = inp.flatMap(::mysqrt).flatmap(::mylog).flatMap(::myinv) as TC.Value
    var out = inp flatMap ::mysqrt flatMap ::mylog flatMap ::myinv
    inp = inp flatMap ::mysqrt flatMap ::mylog flatMap ::myinv
//    println(out.value.data)
//    println(out.value.rem)
//    println()
}

fun <T> execute(input: TC<T>, fns: List<(T) -> TC<T>>): TC<T> =
        fns.fold(input) { inp, fn -> inp.flatMap(fn) }

fun main(args: Array<String>) {
    testMonad()

    println("Async")

    var listOfFunctions: List<(DC) -> TC<DC>> = mutableListOf()
    listOfFunctions += ::mysqrt
    listOfFunctions += ::mylog
    listOfFunctions += ::myinv

    var inp1: TC<DC> = TC.Value(DC(100.0,""))
    var inp2: TC<DC> = TC.Value(DC(200.0,""))

    runBlocking {
        val startTime = System.currentTimeMillis()
        val deferred1 = async { execute(inp1, listOfFunctions) }
        val value1 = deferred1.await() as TC.Value<DC>

        val deferred2 = async { execute(inp2, listOfFunctions) }
        val value2 = deferred2.await() as TC.Value<DC>

        println("${Thread.currentThread().name} : " +
                "${value1.value}")
        println("${Thread.currentThread().name} : " +
                "${value2.value}")

        val endTime = System.currentTimeMillis()

        println("Time taken: ${endTime - startTime}")
    }
}




