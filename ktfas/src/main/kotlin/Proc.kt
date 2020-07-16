package svr

import org.json.simple.JSONArray
import org.json.simple.JSONObject

object Proc {

    fun carAcc(jaCfg :JSONArray, jaCtx: JSONArray) :JSONObject {
        var jsonObject = JSONObject()
        jsonObject.put("val","110")
        return jsonObject
    }
}