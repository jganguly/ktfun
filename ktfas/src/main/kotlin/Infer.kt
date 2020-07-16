package svr

import jdk.nashorn.api.scripting.NashornScriptEngine
import org.json.simple.JSONObject
import org.json.simple.JSONArray
import org.json.simple.parser.JSONParser
import svr.Util.log
import java.lang.Exception
import java.util.ArrayList
import javax.script.*
import svr.Util.post
import java.io.File
import java.io.StringReader
import java.lang.Float.parseFloat
import java.text.SimpleDateFormat
import java.text.DateFormat



object Infer {

    fun rete(rst :String, bid :String) : JSONObject {

        val jdd = getJdd()    // JSON Data Definition
        var jaRule = getRule(rst)

        var ruleStat = mutableMapOf<String,String>()
        for (r in jaRule) {
            var rid = (r as JSONObject)["0"].toString()
            ruleStat.put(rid,"")    // not yet proven, once proven true or false
        }

        val chRule = chunkRule(jaRule)
        log("chunk=$chRule")

        var joData = getCfg()    // Configuration
        joData = getData(bid, joData)

        // Execute Rules
        log("*** EXECUTING ***")

        // Delete output and log
        ServerDB.crud("DELETE FROM fas.out WHERE bid = '${bid}'")
        ServerDB.crud("DELETE FROM fas.log WHERE bid = '${bid}'")

        // Load rules and data

        val engine = ScriptEngineManager().getEngineByExtension("js") as NashornScriptEngine

        var iter = 1
        for (ch in chRule) {    // ch is  chunk of rules
            var ncon = 0
            var str = ""
            while (true) {
                log("iter=$iter")
                for (r in ch) {     // rule in chunk of rules
                    var rid = (r as JSONObject)["0"].toString()
                    var ant = (r as JSONObject)["1"].toString()
                    var con = (r as JSONObject)["2"].toString()

                    str = ant.toString()
                    log("str=${str}")

                    // if predicates in string contains "proc_", procedure calls are required
                    if (str.contains("proc_")) {
                        fireAPI(str, joData)
                    } else {
                        // Pattern match, replace ant with dat
                        log("Pattern Matching")
                        for (d in joData) {
                            val regex = "\\b${d.key.toString().replace(".", "\\.")}\\b".toRegex()
                            str = str.replace(regex, d.value.toString())
                        }
                        log("eval(${str})")
                        evalRule(bid, str, rid, ant, con, ruleStat, joData, engine)
                    }
                }

                if ( str.contains("proc_") ) {
                    break
                }
                else {
                    if (ncon == joData.size) {
                        ncon = 0
                        break;
                    } else {
                        ncon = joData.size
                        iter++
                    }
                }
            }
        }

        log("ruleStat=$ruleStat")

        var jsonObj = JSONObject()
        jsonObj.put("sta","Execution completed")

        return jsonObj
    }

    fun chunkRule(jaRule :JSONArray) :MutableList<MutableList<JSONObject>> {
        var lol = mutableListOf<MutableList<JSONObject>>()  // List of List

        var ml :MutableList<JSONObject> = mutableListOf()
        for (r in jaRule) {
            var ant = (r as JSONObject)["1"].toString()
            if (ant.contains("proc_")) {
                if (ml.size != 0)
                    lol.add(ml)
                ml = mutableListOf()
                ml.add(r)
                lol.add(ml)
                ml = mutableListOf()
            }
            else {
                ml.add(r)
            }
        }
        lol.add(ml)
        return lol
    }

    // Fire API
    fun fireAPI(str :String, joData :JSONObject) {
        // Find the URL endpoint
        val resURL = ServerDB.select(("SELECT url FROM fas.bdg WHERE sym='${str}'"), "String")
        val jarrURL = resURL["rows"] as JSONArray
        val jobjURL = jarrURL[0] as JSONObject
        val url = jobjURL["0"].toString()
        log("Server url=${url}")

        // input to server, all the data from declarative facts, post to the endpoint
        log("Client inp=${joData.toString()}")
        val response = post(url,joData.toString())
        log("Response rec=${response}")

        // Convert response to JSONObject
        val parser = JSONParser()
        val jobj = parser.parse(StringReader(response)) as JSONObject

        // Add to joData
        for (jo in jobj) {
            joData.put(jo.key,jo.value)
        }
        log("joData (upd)=${joData.toString()}\n")
    }

    // JSON Object Defintion
    fun getJdd() :JSONObject {
        var jsonStr = File("/Users/jaideep.ganguly/jg-josh/ktfas/fas/module/jdd/jdd.txt").readText()//.replace("\n","").replace("\t","").replace(" ","")
        var jsonObj = JSONObject()
        jsonObj.put("dic", jsonStr)
//        println("jdd=${jsonStr}\n")
        return jsonObj
    }

    // Validate against jdd
    fun validate(jdd :String, aoc :String, str: String, dat :String) :Boolean {

        var tmp = JSONParser().parse(StringReader(jdd)) as JSONObject
        var tmp2 = tmp.get("dic") as String
        var tmp3 = JSONParser().parse(StringReader(tmp2)) as JSONObject
        tmp = tmp3

        val astr = str.split(".")
        for (i in 0..astr.size-1) {
            try {
                if (i == astr.size - 1) {                       // last
                    var typ = tmp[astr[i]] as String            // String, Float, Double, Date, Boolean
                    if  (aoc.compareTo("ant") == 0) {
                        try {
                            if (!dat.contains("config")) {
                                if (typ.compareTo("Float") == 0) {
                                    val res = parseFloat(dat)
                                    println("$aoc ${str} :$typ true $dat $typ true")
                                    ServerDB.crud("INSERT INTO fas.val (aoc,cnd,sta,typ) VALUES ('ant','$str','true','true')")
                                }
                                else if (typ.compareTo("Date") == 0) {
                                    val format = SimpleDateFormat("yyyy-MM-dd")
                                    val res = format.parse(dat)
                                    println("$aoc ${str} :$typ true $dat $typ true")
                                    ServerDB.crud("INSERT INTO fas.val (aoc,cnd,sta,typ) VALUES ('ant','$str','true','true')")
                                }
                                else if (typ.compareTo("String") == 0) {  // String
                                    println("$aoc ${str} :$typ true $dat $typ true")
                                    ServerDB.crud("INSERT INTO fas.val (aoc,cnd,sta,typ) VALUES ('ant','$str','true','true')")
                                }
                            }
                        } catch (ex :Exception) {
                            println("$aoc ${str} :$typ true $dat $typ false")
                            ServerDB.crud("INSERT INTO fas.val (aoc,cnd,sta,typ) VALUES ('ant','$str','true','false')")
                        }

                        ServerDB.crud("INSERT IGNORE INTO fas.aut (cnd) VALUES ('$str')")
                    }
                    else {  // con
                        if ( typ.compareTo("Boolean") == 0 ) {      // Boolean
                            // true or false
                            if ( (dat.compareTo("true") == 0) || (dat.compareTo("1") == 0) || (dat.compareTo("false") == 0) || (dat.compareTo("0") == 0) ) {
                                println("$aoc ${str} schtyp=$typ dat=$dat dattyp=${dat::class.simpleName.toString()} true")
                                ServerDB.crud("INSERT INTO fas.val (aoc,cnd,sta,typ) VALUES ('con','$str','true','true')")
                            } // not true and not false
                            else if ((dat.compareTo("true") != 0) && (dat.compareTo("1") != 0) && (dat.compareTo("false") != 0) && (dat.compareTo("0") != 0) ) {
                                println("$aoc ${str} schtyp=$typ dat=$dat dattyp=${dat::class.simpleName.toString()} false")
                                ServerDB.crud("INSERT INTO fas.val (aoc,cnd,sta,typ) VALUES ('con','$str','true','false')")
                            }
                            // Float
                            else if (typ.compareTo("Float") == 0) {
                                try {
                                    val res = parseFloat(dat)
                                    println("$aoc ${str} :$typ true Float true")
                                    ServerDB.crud("INSERT INTO fas.val (aoc,cnd,sta,typ) VALUES ('con','$str','true','true')")
                                } catch (ex: Exception) {
                                    println("$aoc ${str} :$typ true Float false")
                                    ServerDB.crud("INSERT INTO fas.val (aoc,cnd,sta,typ) VALUES ('con','$str','true','false')")
                                }
                            }
                        }
                    }
                }
                else {
                    tmp = tmp[astr[i]] as JSONObject
//                    println(tmp)
                }
            }
            catch (ex :Exception) {
                println("$aoc ${str} false")
                ServerDB.crud("INSERT INTO fas.val (aoc,cnd,sta,typ) VALUES ('ant','$str','false','')")
                return false
            }
        }
        return true
    }

    fun getCfg() :JSONObject {
        var sqlCfg = "SELECT att, val FROM fas.cfg"
        var jo = ServerDB.select(sqlCfg,"String,String")
        val rows = jo["rows"] as JSONArray

        var joData = JSONObject()
        for (r in rows) {
            val av = r as JSONObject
            joData.put(av["0"],av["1"])
        }
        log("config=${joData.toString()}\n")
        return joData
    }

    fun getRule(rst :String) :JSONArray {
        // rst is rule set or namespace of rules
        var arst :List<String> = rst.split(",")
        var al = ArrayList<String>()
        for (i in 0..arst.size-1) {
            al.add(arst[i].trim())
        }

        var rid_like = ""
        for (i in 0..al.size-1) {
            if (i == al.size-1)
                rid_like = rid_like + "rid LIKE '%${al.get(i)}%'"
            else
                rid_like = rid_like + "rid LIKE '%${al.get(i)}%' OR "
        }

        var sql = "SELECT rid, ant, con FROM fas.rul WHERE ${rid_like} ORDER BY rid ASC"
        var jaRule = ServerDB.select(sql, "String,String,String")

        log("jaRule=${jaRule["rows"]}\n")
        return jaRule["rows"] as JSONArray
    }

    fun getData(bid :String, joData :JSONObject) :JSONObject {
        val sql = "SELECT bid, att, val FROM fas.dat WHERE bid='${bid}'"
        val data = ServerDB.select(sql, "String,String,String")
        val rows = data["rows"] as JSONArray

        for (r in rows) {
            val av = r as JSONObject
            joData.put(r["1"],r["2"])
        }
        log("joData=${joData.toString()}\n")
        return joData
    }

    fun evalRule(bid :String, str :String, rid :String, ant :String, con :String, ruleStat :MutableMap<String,String>, joData :JSONObject, engine : NashornScriptEngine) {

        try {
            var res = engine.eval(str)
            log("res=${res}")

            if (res == true) {
                var acon = con.split("=")
                joData.put(acon[0].trim(),acon[1].trim())   // Add new data to data
                log("jaData=${joData}")

                var sqlOut = "INSERT IGNORE INTO fas.out (bid,att,val) VALUES( '${bid}', \"${acon[0].trim()}\", ${acon[1].trim()})"
                ServerDB.crud(sqlOut)                       // Write output to DB
            }
            ruleStat.set(rid.toString(), res.toString())
            // true or false
            var sqlLog = "INSERT IGNORE INTO fas.log (bid,rid,ant,con,res) VALUES( '${bid}', '${rid}', \"${ant}\", \"${con}\", '${res}')"
            ServerDB.crud(sqlLog)   // Write log to DB
//            ServerDB.crud("DELETE n1 FROM fas.log n1, fas.log n2 WHERE n1.pmk > n2.pmk AND n1.rid = n2.rid")

        } catch (e: Exception) {    // eval failed
            log("res=eval failed")
        }
    }





}

