// https://www.baeldung.com/kotlin-khttp
package cli

import com.google.gson.GsonBuilder
import com.google.gson.JsonArray
import com.google.gson.internal.LinkedTreeMap
import khttp.post
import org.json.JSONArray

fun main(args: Array<String>) {

    cli.client(JsonArray())
}


fun client(jsonArray: JsonArray) {

    val t1 = System.currentTimeMillis()

    var str = "SELECT rid,ant,con,rem FROM fas.rul"
    var typ = "Int, String, String, String"
    val response = khttp.post(
        url = "http://localhost:8080/post",
        data = mapOf("sql" to str, "typ" to typ) ).text
    println(response)

    val gson = GsonBuilder().create()
    val mapFromJson = gson.fromJson(response, List::class.java)
    val s1 = (mapFromJson[0] as Map<String, Any>)

    for (i in 0 .. mapFromJson.size-1) {
        val item = mapFromJson.get(i) as LinkedTreeMap<String, Any>
        val key = i.toString() + "-" + 0.toString()
        println(item[key])
    }
    val t2 = System.currentTimeMillis()

    println(t2-t1)

}