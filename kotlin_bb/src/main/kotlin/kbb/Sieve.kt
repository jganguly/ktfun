package kbb

import kotlinx.coroutines.Deferred
import kotlinx.coroutines.async
import kotlinx.coroutines.runBlocking

object Sieve {

    fun sieveOfEratosthenes(listOfNumbers: MutableList<Int>) {

        var originalList = listOfNumbers.toMutableList()

        /* Correct answer */
        var primeList = mutableListOf<Int>()
        println("Using Iterator")
        println(originalList)
        var iterator: MutableIterator<Int> = originalList.iterator()


        while (iterator.hasNext()) {

            var element = originalList[0]

            while (iterator.hasNext()) {
                var number = iterator.next()
                if (number % element == 0) {
                    iterator.remove()
                }
            }
            primeList.add(element)
            iterator = originalList.iterator()
        }
        println(primeList)

    }

    fun sieveOfEratosthenesFP(listOfNumbers: MutableList<Int>): MutableList<Int> {
        var originalList = listOfNumbers.toMutableList()
        var primeList = mutableListOf<Int>()

        println("\nFunctional")
        originalList = listOfNumbers.toMutableList()
        println(originalList)
        primeList = mutableListOf()
        while (originalList.size != 0) {

            var first = originalList.elementAt(0)
            primeList.add(first)
            var rest = originalList.subList(1,originalList.size).filter { it % first != 0}
            originalList = rest.toMutableList()
        }
        println(primeList)

        return primeList
    }

    suspend fun susSieveOfEratosthenes(listOfNumbers: MutableList<Int>, sublist: MutableList<Int>): MutableList<Int> {

        println("\nFunctional")
        var originalList = sublist.toMutableList()
        println(originalList)
        var primeList = mutableListOf<Int>()

        for (i in 0 .. listOfNumbers.size){
            if (originalList.size != 0) {
                var first = originalList.elementAt(0)
                primeList.add(first)
                var rest = originalList.subList(1, originalList.size).filter { it % listOfNumbers.elementAt(i) != 0 }
                println("${first} ${originalList}")
                originalList = rest.toMutableList()
            }
        }
        println(primeList)

        return primeList
    }



    fun sieveOfEratosthenesPP(listOfNumbers: MutableList<Int>)  = runBlocking{

        var originalList = listOfNumbers.toMutableList()
        var primeList = mutableListOf<Int>()


        println("\nCoroutine")
        originalList = listOfNumbers.toMutableList()
        println(originalList.size)
        val list1 = originalList.subList(0,originalList.size/2+1)
        val list2 = originalList.subList(originalList.size/2+1, originalList.size)
        println(list1)
        println(list2)

        val deferred1 = async { susSieveOfEratosthenes(listOfNumbers, list1) }
        val deferred2 = async { susSieveOfEratosthenes(listOfNumbers, list2) }

        val finalList = mutableListOf(deferred1.await(), deferred2.await()).toMutableList()
        println(finalList)
    }


    @JvmStatic
    fun main(args: Array<String>) {

        println("Sieve of Eratosthenes")
        var listOfNumber = mutableListOf<Int>()
        for (i in 2 .. 50) {
            listOfNumber.add(i)
        }
        sieveOfEratosthenes(listOfNumber)
        sieveOfEratosthenesFP(listOfNumber)

        val t1 = System.currentTimeMillis()
        sieveOfEratosthenesPP(listOfNumber)
        val t2 = System.currentTimeMillis()
        println("Time taken: ${t2-t1} ms")

    }
}