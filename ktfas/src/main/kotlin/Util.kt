package svr


import org.json.simple.JSONArray
import org.json.simple.JSONObject
import java.io.File
import com.github.kittinunf.fuel.Fuel
import org.json.simple.parser.JSONParser
import java.io.StringReader
import java.lang.Exception
import svr.Util.log


object Util {

    var fw = File("/Users/jaideep.ganguly/jg-josh/ktfas/fas/debug.txt")

    // log
    fun log(str: String) {
        fw.appendText(str + "\n")
    }

    // Init Context
    fun initCtx(): JSONObject {
        return JSONObject()
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

    // Find con ... not used
    fun find (jobj :JSONObject, att :String, dat :String) : String {
        for (jo in jobj as JSONObject) {
            var jo = jo as JSONObject
            val res = jo.get(att)
            if (res == dat)
                return "match"
        }

        return "nomatch"
    }
}




