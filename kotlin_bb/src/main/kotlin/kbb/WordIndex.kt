package kbb

import java.io.File
import java.util.regex.Pattern

object WordIndex {

    fun wordindex(fileName: String) {

        var mapWordIndex = mutableMapOf<String, MutableList<Pair<Int, Int>>>()    // [ 'hello', ( (1,10), (4, 20), (5, 3) ) ]

        var i = 0
        val regex = "[a-zA-Z_0-9]"  // valid words will have these characters
        val pattern = Pattern.compile(regex)

        File(fileName).forEachLine {

            var word: StringBuilder

            if (it.isNotEmpty()) {  // line must not be empty

                var j = 0           // starting position of the character in the line
                while (true) {

                    if (j == it.length - 1) {   // end of line reached
                        break
                    }

                    var c: Char = it[j]         // get the character in the String

                    var matcher = pattern.matcher(c.toString()) // matcher expects String as argument
                    if (!matcher.matches()) {   // if a "regular" character continue
                        j++
                        continue;
                    }
                    else {
                        word = StringBuilder()  // start building the word
                        for (k in j until it.length-1) {
                            word.append(it[k])

                            matcher = pattern.matcher(it[k + 1].toString())
                            if (!matcher.matches()) {   // does not match a regular character, is a delimiter

                                var strWord = word.toString()

                                var listIndex: MutableList<Pair<Int, Int>>? = mapWordIndex[strWord]

                                if (listIndex == null) {    // if list does not exist, create the value
                                    var mList = mutableListOf<Pair<Int, Int>>() as MutableList
                                    mList.add(Pair(i, j))
                                    mapWordIndex.put(strWord, mList)
                                }
                                else {
                                    listIndex.add(Pair(i, j))
                                    mapWordIndex[strWord] = listIndex
                                }

                                j = k + 1
                                break
                            }
                        }
                        println(word)
//                    readLine()
                    }
                }

                i++
                println()
            }
        }
        println(mapWordIndex)
    }


    @JvmStatic
    fun main(args: Array<String>) {

        wordindex("/Users/jaideep.ganguly/jg-josh/kotlin_bb/src/main/kotlin/kbb/aninput1.txt")
    }
}