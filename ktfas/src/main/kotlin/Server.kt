// https://ktor.io/servers/calls/requests.html#post-put-and-patch
// https://www.mkyong.com/java/json-simple-example-read-and-write-json/

package svr

import io.ktor.application.call
import io.ktor.features.origin
import io.ktor.http.content.files
import io.ktor.http.content.static
import io.ktor.request.receive
import io.ktor.request.receiveParameters
import io.ktor.request.uri
import io.ktor.response.respondFile
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.routing
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import org.apache.commons.jxpath.JXPathContext
import org.json.simple.JSONArray
import org.json.simple.JSONObject
import org.json.simple.parser.JSONParser
import svr.Infer.getJdd
import java.io.File
import svr.Util.log
import java.io.StringReader

fun server() : Unit {

    println("ktor server started ...")
    var con = ServerDB.getConnection()
    var tok_svr = ""

    embeddedServer(Netty, 8080) {

        routing {
            // web access via: http://localhost:8080/static/module/rul/rul.html
            static("static") {
                val path = System.getProperty("user.dir")   // Working directory is "ktfas"
                println("Working Directory = $path")
                files("/Users/jaideep.ganguly/jg-josh/ktfas/fas")
            }

            get("/login") {
                log(call.request.origin.host)
                log(call.request.uri)
                call.respondFile(File("fas"),"/module/login/login.html")
            }

            post("/login/post") {
                log("/login/post")
                val receiveParameters = call.receiveParameters()      // post
                val uid = receiveParameters["uid"]
                val pwd = receiveParameters["pwd"]
                var sql = "SELECT rol FROM fas.usr where uid='${uid}' AND pwd='${pwd}'"
                var jsonObj = ServerDB.select(sql, "String")

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
                    log("role=${rol}")
                }
                catch (ex: Exception) {
                    nrow = 0
                }

                jsonObj = JSONObject()
                if (nrow == 1) {
                    tok_svr = System.currentTimeMillis().toString()     // Assign a session token
                    jsonObj.put("rol",rol)
                    jsonObj.put("tok",tok_svr)
                    log(tok_svr)
                    jsonObj.put("url","/static/module/rul/rul.html")
                }
                else {
                    log("Login failed")
                    tok_svr = "-1"      // Invalid session
                    jsonObj.put("url","/static/module/login/loginfail.html")
                }

                call.respondText(jsonObj.toString())
            }

            post("/token") {
                log(call.request.uri)
                val receiveParameters = call.receiveParameters()
                val tok_cli = receiveParameters["tok"].toString()
//                log("Client Token = $tok_cli")
//                log("Server Token = $tok_svr")
                var jsonObj = JSONObject()
                if (tok_cli == tok_svr)  {
                    jsonObj.put("token", true)
                }
                else {
                    jsonObj.put("token",false)
                }
//                log("token = $joTok")
                call.respondText(jsonObj.toString())
            }

            post("/select") {
                log(call.request.uri)
                val receiveParameters = call.receiveParameters()
                val sql = receiveParameters["sql"].toString()
                val typ = receiveParameters["typ"].toString()
                val tok_cli = receiveParameters["tok"].toString()

                if (tok_cli == tok_svr) {
                    var jsonObj = JSONObject()
                    jsonObj = ServerDB.select(sql, typ)
                    call.respondText(jsonObj.toString())
                }
            }

            post("/crud") {
                log(call.request.uri)
                val receiveParameters = call.receiveParameters()
                val sql = receiveParameters["sql"].toString()
                val tok_cli = receiveParameters["tok"].toString()

                if (tok_cli == tok_svr) {
                    var jsonObj = JSONObject()
                    jsonObj = ServerDB.crud(sql)
                    call.respondText(jsonObj.toString())
                }
            }

            post("/dict") {
                log(call.request.uri)
                val receiveParameters = call.receiveParameters()
                val tok_cli = receiveParameters["tok"].toString()
                if (tok_cli == tok_svr) {
                    val jdd = getJdd()
                    call.respondText(jdd.toString())
                }
            }

            post("/infer") {
                log(call.request.uri)
                val receiveParameters = call.receiveParameters()
                val rst = receiveParameters["rst"].toString()
                val bid = receiveParameters["bid"].toString()
                log("rst=${rst} bid=${bid}")
                val tok_cli = receiveParameters["tok"].toString()
                if (tok_cli == tok_svr) {
                    var jsonObject = Infer.rete(rst,bid)
                    call.respondText(jsonObject.toString())
                }
            }

            // validate against jdd
            post("/validate") {
                log(call.request.uri)

                ServerDB.crud("DELETE FROM fas.val")

                val receiveParameters = call.receiveParameters()
                val tok_cli = receiveParameters["tok"].toString()
                if (tok_cli == tok_svr) {
                    var jdd = Infer.getJdd().toString()
                    jdd = jdd.replace("\\n", "").replace("\\t", "").replace("\\s+".toRegex(), "")

//                    println("\n"+jdd+"\n")

                    var sql = "SELECT rid, ant, con FROM fas.rul"
                    var data = ServerDB.select(sql, "String,String,String")
                    var jaRule = data["rows"] as JSONArray

                    // Validate with jdd
                    for (r in jaRule) {
                        var ant = (r as JSONObject)["1"].toString()
                        var con = (r as JSONObject)["2"].toString()

                        /* ant - strip tab, nl, conditions */
                        ant = ant.replace("\\n+".toRegex(), "").replace("\\t+".toRegex(), "")
                            .replace("(", "").replace(")", "")
                            .replace("&&", "").replace("||", "")
                            .replace("==", "").replace("<=", "").replace("<", "").replace(">=", "").replace(">", "")
                            .replace("!=", "")
//                        println("ant=${ant}\n")

                        // split by space as delimiter
                        val aant = ant.split("\\s+".toRegex())
//                        println(aant)

                        // create list of string excluding the values and excluding "proc_"
                        var mlstr = mutableListOf<String>()  // mutable list of string
                        var mlval = mutableListOf<String>()  // mutable list of values
                        for (i in 0..aant.size - 1 step 2) {
                            val str = aant[i].replace("\\s".toRegex(), "")
                            if (!(str.contains("proc_"))) {
                                if (str.compareTo("") != 0)
                                    mlstr.add(str)
                                    mlval.add(aant[i+1])
                            }
                        }

                        // ant - validate the strings in the list
                        for (i in 0..mlstr.size-1) {
                            val status = Infer.validate(jdd, "ant", mlstr[i], mlval[i])
                        }

                        /* con - strip tab, nl, conditions */
                        con = con.replace("\\n+".toRegex(), "").replace("\\t+".toRegex(), "")
                        val acon = con.split("\\s+".toRegex())
                        val s = acon[0]
                        if ((s.compareTo("true") != 0) && (s.compareTo("false") != 0)) { // exclude con which are true or false
                            val status = Infer.validate(jdd, "con", s, acon[2])
                        }
                    }
                    call.respondText(JSONObject().toString())
                }
            }


            // simulate a post call
            post("/proxy/getVar") {
                log("Server Proxy=${call.request.uri}")
                val inp = call.receive<String>()
                log("Server inp=${inp}")
                val lineItem =
                    """
                        {
                            "invoice.lineItem.inpVar" 			: 88,
                            "invoice.lineItem.inpVarPct" 		: 0,
                        }
                        """.trimIndent()
                val parser = JSONParser()
                var jobj = parser.parse(StringReader(lineItem)) as JSONObject
                log("Server out=${jobj.toString()}")
                call.respondText(jobj.toString())
            }

            post("/proxy/getAmt") {
                log("Server Proxy=${call.request.uri}")
                val inp = call.receive<String>()
                log("Server inp=${inp}")
                val lineItem =
                    """
                        {
                            "invoice.lineItem.freightAmt" 		: 52,
                            "invoice.lineItem.matchedQtyPctTol" : -1,
                            "invoice.lineItem.miscAmt" 			: 5,
                            "invoice.lineItem.miscAmtPct" 		: 5,
                            "invoice.lineItem.pqvAmt" 			: 53,
                            "invoice.lineItem.scvAmt" 			: 40,
                            "invoice.lineItem.ppvAmt" 			: 12,
                            "invoice.lineItem.pcvAmt" 			: 13,
                            "invoice.lineItem.epcAmt" 			: 11
                        }
                        """.trimIndent()
                val parser = JSONParser()
                var jobj = parser.parse(StringReader(lineItem)) as JSONObject
                log("Server out=${jobj.toString()}")
                call.respondText(jobj.toString())
            }

        }
    }.start(wait = true)
}
