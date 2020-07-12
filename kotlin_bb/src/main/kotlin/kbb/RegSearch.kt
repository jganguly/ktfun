package kbb

import java.util.*
import java.util.regex.*

object RegSearch {

    fun search(regex: String, input: String, caseSensitive: Boolean) : List<Triple<String,Int,Int>> {
        var regexPattern = regex
        var inputString = input
        var listFound = mutableListOf<Triple<String,Int,Int>>()

        // case sensitive, default is true
        if (!caseSensitive) {
            regexPattern = regex.toLowerCase()
            inputString = input.toLowerCase()
        }

        val pattern: Pattern = Pattern.compile(regexPattern)
        val matcher: Matcher = pattern.matcher(inputString)

        var result: Boolean = false
        while (matcher.find()) {
            listFound.add(Triple(regex,matcher.start(),matcher.end()))
        result = true
    }

        return listFound
    }

    fun tokenize(str: String): Unit {

        val delimiters = " |,|;"
        var strTok = StringTokenizer(str,delimiters)

        var iterator = strTok.iterator()
        while (iterator.hasNext())
        {
            println(iterator.next())
        }

    }


    @JvmStatic
    fun main(args: Array<String>) {
        println("Welcome to Kotlin Building Blocks\n")

        tokenize("Hello, how are; you.")

//        var result = search("kotlin", "Welcome to Kotlin", false)
//        println(result)


    }
}