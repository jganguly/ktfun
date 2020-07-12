[TOC]

# Introduction - Kotlin Building Blocks

Here are some code snippets that are essentially building blocks for developing solutions for more complex problems.

# Search

## Regex Search
The function `search` uses `regex` pattern matching to find occurances of a pattern in a given input string.
```kotlin
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
```

# Recursion

Given a twitter hash tag, find the words that below to a given dictionary.

> Note: Recursion uses `call stack`. The returned values are accumulated in an argument of the function.

```kotlin
package kbb

object Hashtag {

    fun hashTagToWords(hashTag: String, dictWords: Set<String>): MutableList<String> {
        var found = mutableListOf<String>()
        found = recurse(hashTag, dictWords, 0, found) as MutableList<String>
        return found
    }

    fun recurse(hashTag: String, dictWords: Set<String>, startPos: Int, breakUp: MutableList<String>): MutableList<String> {
        val endPos = hashTag.length - 1
        var paramList = breakUp

        if (startPos == endPos) {
            paramList.addAll(breakUp)
            return paramList
        }

        for (i in startPos..endPos) {
            val curPossibleWord = hashTag.substring(startPos, i + 1)
            if (!dictWords.contains(curPossibleWord)) {
                continue
            }

            paramList.add(curPossibleWord)
            println("${curPossibleWord} ${breakUp}")
            recurse(hashTag, dictWords, i + 1, paramList)
        }

        return paramList
    }

    @JvmStatic
    fun main(args: Array<String>) {
        val found = hashTagToWords(
            "bindrawinsgold",
            setOf("i", "you", "bindra", "gold", "silver", "wins", "love")
        )
        println(found)
    }
}
```


# Prime Number - Sieve of Eratosthenes

Find prime numbers in a list of numbers. Use functional programming. Use parallel processing. 

```kotlin
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
```

# Word Indexing

Given a file, index word positions using line number and column position.

```kotlin
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
```

# Word Frequency

```kotlin
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
```

# TimeOut Adapter

```kotlin
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
    val timeOutAdaptor = TimeOutAdapter(canTimeout, 500)
    input = "Hello!"
    val result = timeOutAdaptor.apply(input)
    println(result)
}
```

# Json

To access the `key` `value` pairs, you will need to convert the `String` to `JsonNode`

Use `jackson` to serialize to and deserialize from `data class`

```kotlin
package kbb

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.fasterxml.jackson.module.kotlin.readValue

object Json {
    fun createJSONNode(): JsonNode {

        val data = """
            [
                {
                    "id" : "100",
                    "name": "jaideep",
                    "address" : {
                        "city" : "hyderabad",
                        "zip" : "500084"
                    }
                },
                {
                    "id" : "101",
                    "name": "suvradeep",
                    "address" : {
                        "city" : "new york",
                        "zip" : "11000"
                    }
                }
            ]
        """.trimIndent()
        val jsonNode = ObjectMapper().readTree(data)
        return jsonNode
    }


    data class Person (val id: Int, val name: String, val address: MutableList<Address>)
    data class Address (val city: String, val pin: Int)

    fun serializeFromDC(listOfPer: MutableList<Person>): String {
        val serialized = ObjectMapper()
            .registerModule(KotlinModule())
            .writeValueAsString(listOfPer)
        return serialized
    }

    fun deSerializeToDC(text: String): MutableList<Person> {
        val mapper = ObjectMapper().registerModule(KotlinModule())
        val listOfPer: MutableList<Person> = mapper.readValue(text)
        return listOfPer
    }

    fun createColl(): MutableList<Person> {
        val addr1 = Address("Hyderabad",   400001)
        val addr2 = Address("Pune",        500001)

        val addr3 = Address("New York",    11000)
        val addr4 = Address("Boston",      12000)

        val per1 = Person(100,"Ram", mutableListOf(addr1,addr2))
        val per2 = Person(101, "Tim", mutableListOf(addr3,addr4))

        var listOfPer = mutableListOf<Person>(per1, per2)

        // List iterator
        var iterator = listOfPer.listIterator()
        while(iterator.hasNext()) {
            var person = iterator.next()
            println(person)
        }

        // Filter using FP
        var filterListOfPer = listOfPer.map { it ->
            val addr = it.address
            addr.filter { it2 -> it2.pin > 300000}
        }.filter { it.isNotEmpty() }
        println(filterListOfPer)

        return listOfPer
    }


    @JvmStatic
    fun main(args: Array<String>) {
        var jsNode = createJSONNode()
        println(jsNode.toPrettyString())
        println(jsNode!![1]["address"].toPrettyString())

        val listOfPer = createColl()
        val serialized = serializeFromDC(listOfPer)
        println(serialized)

        val listOfPer2 = deSerializeToDC(serialized)
        println(listOfPer2)
    }
}
```

# Ktor - Server & Client

## HTML

Note how `static` is used in `link` and `href`

```kotlin
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" content="width=device-width, initial-scale=1.0">
    <title>Login</title>

    <script  type="text/javascript"                   src ="/static/libjs/jquery.js">                           </script>
    <script  type="text/javascript"                   src ="/static/libjs/jquery-ui-1.11.4/jquery-ui.js">       </script>
    <script  type="text/javascript"                   src ="/static/libjs/json-viewer/json-viewer.js">          </script>
    <link    type="text/css"    rel="stylesheet"      href="/static/libjs/jquery-ui-1.11.4/jquery-ui.css">

    <link    type="text/css"    rel="stylesheet"      href="/static/libjs/json-viewer/json-viewer.css">

    <link    rel="stylesheet"   type="text/css"       href="https://fonts.googleapis.com/css?family=Ubuntu">

    <link    rel="stylesheet"        href="/static/css/style.css" type="text/css">
    <link    rel="shortcut icon"     href="/static/icon/fab.png"   type="image/x-icon"/>

    <script  type="text/javascript"  src="/static/libjs/common.js"></script>
    <script  type="text/javascript"  src="/static/login.js"></script>

</head>



<body style="height:100%;">

    <div class="CLS_DIV_CEN">

    <div class="CLS_DIV_CEN" style="margin-left:0px;">
    
    	<div style="width:20%; margin: 0 auto">
    
    		<div style="width:100%; padding-top:200px; border:0px solid red;">
    			<div>
    				<div style="width:200%; font-size:2.0em; margin-left:-110px; color:cyan; font-weight:bold; font-style:italic; text-align: center">Title</div>
    				<div style="width:200%; font-size:2.0em; margin-left:-110px; color:cyan; font-weight:bold; font-style:italic; text-align: center">Sub Title</div>
    				<BR/>
    			</div>
    
    			<div class="CLS_DIV_HOL">
    				<label class="label" >User ID</label>
    				<input class="text" style="width:90%" type="text" name="tbx_uid" id="id_tbx_uid" autocomplete="on"/>
    			</div>
    
    			<BR/>
    
    			<div class="CLS_DIV_HOL">
    				<label class="label" >Password</label>
    				<input class="text" style="width:90%" type="password" name="tbx_pwd" id="id_tbx_pwd" autocomplete="off"  />
    			</div>
    
    			<BR/>
    			<BR/>
    
    			<div class="CLS_DIV_HOL" style="text-align:center">
    				<input type="submit" style="background:blue; width:40%; margin-left:00px;" name="submit" id="submit" value="Login" onclick="login();"/>
    			</div>
    
    		</div>
    
    	</div>
    </div></div>

</body>
</html>
```

## Javascript

```kotlin
$(function() {
});

var successFunc = function( data, textStatus, jQxhr  ) {    // callback function, resp = response from server
};

var errorFunc = function( jqXhr, textStatus, errorThrown  ) {    // callback function, resp = response from server
    console.log("Error:" + errorThrown);
};

function login() {
    var uid = get('uid');
    var pwd = get('pwd');
    var pageData = {"uid":uid, "pwd":pwd};
    sessionStorage.setItem('uid',uid)

    var jqXHR = $.ajax({
        url: '/login/post',
        type: 'POST',
        dataType: 'JSON',
        data: pageData,
        async: false,
        successFunc: successFunc,
        error: errorFunc
    });

    var rol = jqXHR.responseJSON["rol"];
    var tok  = jqXHR.responseJSON['tok'];    // token
    //    var url  = data['url'];    // url
    //    window.location.href = url;
    //    alert(url);

    alert(rol);
    alert(tok);

    sessionStorage.setItem('rol',rol);
    sessionStorage.setItem('tok',tok);
}

```

## Server

Note,`routing`and  `static` usage. 3 typical routing, read `template file`, `form post` and `ajax post`

```kotlin
package svr

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import io.ktor.application.call
import io.ktor.features.origin
import io.ktor.http.content.files
import io.ktor.http.content.static
import io.ktor.request.receiveParameters
import io.ktor.request.receiveText
import io.ktor.request.uri
import io.ktor.response.respondFile
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.routing
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import org.json.simple.JSONObject
import java.io.File


object Server {

    fun server() : Unit {

        var con = DB.ServerDB.getConnection()
        var tok_svr = ""

        embeddedServer(Netty, 8080) {

            routing {
                /*
                 * Using the static function, we can tell Ktor that we want certain URIs
                 * to be treated as static content and also define where the content resides.
                 * All content is relative to the current working directory.
                 */
                static("static") {

                /*  val cwd = System.getProperty("user.dir")
                    println(cwd)
                */
                    files("content")
                }

                /*  This will load the blank html page */
                get("/login") {
                    Util.log(call.request.origin.host)
                    Util.log(call.request.uri)
                    call.respondFile(File("content","login.html"))
                }

                /* Ajax Post in the accompanying js file corresponding to the html page */
                post("/login/post") {
                    Util.log("/login/post")
                    /* Form Parameters (urlencoded or multipart) */
                    val receiveParameters = call.receiveParameters()
                    val uid = receiveParameters["uid"]
                    val pwd = receiveParameters["pwd"]
                    println("${uid} ${pwd}");
                    Util.log("${uid} ${pwd}");

                    // Return jobj to browser
                    var jsonObj = JSONObject()
                    jsonObj.put("rol", "admin")
                    jsonObj.put("tok", "500")
                    call.respondText(jsonObj.toString())
                }

                /* Fuel client making an Ajax Post */
                post("/ajax/post") {
                    Util.log("/ajax/post")
                    /* Receive data from Fuel post */
                    val text = call.receiveText()
                    Util.log(text)
                    val mapper = ObjectMapper()
                    val jsonNode = mapper.readTree(text)
                    println(jsonNode)
                    Util.log(jsonNode.toString())

                    /* Return jobj to Fuel client */
                    var jsonObj = JSONObject()
                    jsonObj.put("rol", "admin")
                    jsonObj.put("tok", "500")
                    call.respondText(jsonObj.toString())
                }


//                    var sql = "SELECT rol FROM fas.usr where uid='${uid}' AND pwd='${pwd}'"
//                    var jsonObj = DB.ServerDB.select(sql, "String")

                    /*
                    var nrow :Int
                    var rol  :String = ""
                    // Apache JXPath
                    try {
                        val context = JXPathContext.newContext(jsonObj)
                        var rows = context.getValue("rows") as JSONArray
                        nrow = context.getValue("nrow") as Int
                        var role = context.getValue("rows[1]")              // index starts with 1
                        role = role as Map<String, String>
                        rol = role.get("0") as String
                        Util.log("role=${rol}")
                    }
                    catch (ex: Exception) {
                        nrow = 0
                    }

                    jsonObj = JSONObject()
                    if (nrow == 1) {
                        tok_svr = System.currentTimeMillis().toString()     // Assign a session token
                        jsonObj.put("rol",rol)
                        jsonObj.put("tok",tok_svr)
                        Util.log(tok_svr)
                        jsonObj.put("url","/static/module/rul/rul.html")
                    }
                    else {
                        Util.log("Login failed")
                        tok_svr = "-1"      // Invalid session
                        jsonObj.put("url","/static/module/login/loginfail.html")
                    }

                    */

//                    call.respondText(jsonObj.toString())


                post("/select") {
                    Util.log(call.request.uri)
                    val receiveParameters = call.receiveParameters()
                    val sql = receiveParameters["sql"].toString()
                    val typ = receiveParameters["typ"].toString()
                    val tok_cli = receiveParameters["tok"].toString()

                    if (tok_cli == tok_svr) {
                        var jsonObj = JSONObject()
                        jsonObj = DB.ServerDB.select(sql, typ)
                        call.respondText(jsonObj.toString())
                    }
                }

                post("/crud") {
                    Util.log(call.request.uri)
                    val receiveParameters = call.receiveParameters()
                    val sql = receiveParameters["sql"].toString()
                    val tok_cli = receiveParameters["tok"].toString()

                    if (tok_cli == tok_svr) {
                        var jsonObj = JSONObject()
                        jsonObj = DB.ServerDB.crud(sql)
                        call.respondText(jsonObj.toString())
                    }
                }

            }
        }.start(wait = true)
    }

    @JvmStatic
    fun main(args: Array<String>) {
        println("Ktor server Starting ...")
        Util.log("Ktor server Starting ...")
        server()
    }
}
```

## Fuel Client

```kotlin
package cli

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.Parameters
import com.github.kittinunf.fuel.httpGet
import com.github.kittinunf.result.Result;
import javafx.application.Application.launch
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.async
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.json.simple.JSONObject

import kotlinx.coroutines.*
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

object Client {

    // log
    fun log(str: String) {
        Util.fw.appendText(str + "\n")
    }


    fun get(url: String): String {
        var data = ""

        val (request, response, result) = "https://httpbin.org/get"
            .httpGet()
            .responseString()

        when (result) {
            is Result.Failure -> {
                val ex = result.getException()
                println(ex)
            }
            is Result.Success -> {
                val data = result.get()
                println(data)
            }
        }
        return data
    }


    fun post (url: String, data: String ): String {
        var resp: String = ""
//        println(url)
//        println(data)

        val (request, response, result) = Fuel.post(url)
            .body(data)
            .responseString()

        when (result) {
            is Result.Failure -> {
                val ex = result.getException()
                println(ex)
            }
            is Result.Success -> {
                 resp = result.get()
            }
        }
        return resp
    }


    @JvmStatic
    fun main(args: Array<String>) {

//        println("Calling fuel get")
//        data = get("http://localhost:8080/login")


        // POST
        var jobj = JSONObject()
        jobj.put("uid","jaideep")
        jobj.put("pwd","ganguly")

//        var data = """
//            { "uid" : "foo",
//              "pwd" : "bar"
//            }
//        """
        var resp: String = ""

        val t1 = System.currentTimeMillis()

        val customDispatcher = Executors.newFixedThreadPool(5)
            .asCoroutineDispatcher()
        runBlocking(customDispatcher) {
            for (i in 1 .. 1) {
                resp = post("http://localhost:8080/ajax/post", jobj.toString())
                println(resp)
            }
        }
        (customDispatcher.executor as ExecutorService).shutdown()
        val t2 = System.currentTimeMillis()
        println("${(t2 - t1)} ms")
    }

}

```
