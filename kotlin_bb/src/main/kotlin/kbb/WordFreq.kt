package kbb

import java.io.File
import java.util.*
import java.util.regex.Pattern

object WordFreq {

    fun wordfreq(fileName: String): List<Pair<String, Int>> {

        var mapWordIndex = mutableMapOf<String,Int>()

        var i = 0
        val delimiters = " |,|;|?|!"
        File(fileName).forEachLine {

            var strTok = StringTokenizer(it,delimiters)
            var iterator = strTok.iterator()
            while (iterator.hasNext()) {
                val word = (iterator.next() as String).toLowerCase()

                var count: Int? = mapWordIndex[word]

                if (count == null) { // word does not exist
                    mapWordIndex.put(word, 1)
                } else {
                    mapWordIndex[word] = count + 1
                }
//              println(word)
//              readLine()
            }

            i++
//          println()

        }
//      println(mapWordIndex)

        var wordList = mutableListOf<Pair<String,Int>>()

        for ((key, value) in mapWordIndex) {
            wordList.add(Pair(key,value))
        }

        val sortedWordList = wordList.sortedByDescending { it.second }
//    println(sortedWordList)

        return sortedWordList
    }


    @JvmStatic
    fun main(args: Array<String>) {
        val sortedWordList = wordfreq("/Users/jaideep.ganguly/jg-josh/kotlin_bb/src/main/kotlin/kbb/aninput1.txt")
        println(sortedWordList)
    }
}