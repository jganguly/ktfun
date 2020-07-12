package kbb

import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.FuelError
import com.github.kittinunf.fuel.httpGet
import com.github.kittinunf.result.Result;
import com.github.kittinunf.result.getAs
import java.io.File

object Util {

    var fw = File("/Users/jaideep.ganguly/jg-josh/kotlin_bb/log.txt")

    // log
    fun log(str: String) {
        fw.appendText(str + "\n")
    }

    // Fuel.post
    fun post (url: String, jobj: String ): String {
        val (request, response, result) = Fuel.post(url)
            .appendHeader("Content-Type", "application/json")
            .body(jobj.toString())
            .response()

        val (payload, error) = result

        // Error handling can be improved
        error?.message?.let { println(it) }

        return response
            .body()
            .asString("application/json")
    }

    fun get(url: String): String {
        var data = ""

        url.httpGet().responseString { request, response, result->
            when(result) {
                is Result.Failure -> {
                    val error = result.getException()
                }
                is Result.Success -> {
                   data = result.get()
                }
            }
        }
        return data
    }



}