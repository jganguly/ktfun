package kbb

import org.json.simple.JSONArray
import org.json.simple.JSONObject
import java.sql.*
import java.util.*

object DB {

    internal var conn :Connection? = null

    // DB Connection
    fun getConnection(username: String, password: String) {

        val connectionProps = Properties()
        connectionProps.put("user", username)
        connectionProps.put("password", password)
//        println(connectionProps)

        try {
            Class.forName("com.mysql.cj.jdbc.Driver").newInstance()
            conn = DriverManager.getConnection(
                "jdbc:" + "mysql" + "://" +
                        "127.0.0.1" +
                        ":" + "3306" + "/" +
                        "",
                connectionProps)
            println("DB connection opened")
        } catch (ex :SQLException) {
            // handle any errors
            ex.printStackTrace()
        } catch (ex :Exception) {
            // handle any errors
            ex.printStackTrace()
        }
    }

    // SELECT
    fun select(sql: String, typ: String): JSONObject {

        println(sql)
        var listCol: List<String>
        listCol = sql.toLowerCase().split("select")[1].split("from")[0].split(",")
            .map { it -> it.trim()}

        var atyp = typ.split(",")
            .map { it -> it.trim()}
        println(atyp)

        var stmt:      Statement? = null
        var resultset: ResultSet? = null

        var jsonArray = JSONArray()

        var ncol = 0
        var nrow = 0

        try {
            stmt = conn!!.createStatement()

            stmt.execute(sql)
            resultset = stmt.resultSet
            val rsmd :ResultSetMetaData = resultset!!.metaData
            ncol = rsmd.columnCount
            val col = arrayOfNulls<Any>(ncol)

            while (resultset!!.next()) {

                var jsonObj = JSONObject()

                for (i in 0..(ncol - 1)) {
                    if (atyp[i].compareTo("Int") == 0) {
                        col[i] = resultset.getInt(i + 1).toString()
                    }
                    else if (atyp[i].compareTo("String") == 0) {
                        col[i] = resultset.getString(i + 1).toString()
                    }
                    else if (atyp[i].compareTo("Float") == 0) {
                        col[i] = resultset.getFloat(i + 1).toString()
                    }
                    else if (atyp[i].compareTo("Date") == 0) {
                        col[i] = resultset.getDate(i + 1).toString()
                    }
                }

                for (j in 0..(ncol - 1)) {
//                    jsonObj.put(colName.get(j), col.get(j))
                    jsonObj.put(j.toString(), col.get(j))
                }

                jsonArray.add(jsonObj)
                nrow++
            }
        } catch (ex: SQLException) { // handle any errors
            ex.printStackTrace()
        }
        finally {
            // release resources
            if (resultset != null) {
                try {
                    stmt?.close()
                    resultset.close()
                } catch (sqlEx: SQLException) {
                    sqlEx.printStackTrace()
                }

                resultset = null
            }

            if (stmt != null) {
                try {
                    stmt.close()
                }
                catch (sqlEx: SQLException) {
                    sqlEx.printStackTrace()
                }

                stmt = null
            }

            /*if (conn != null) {
                try {
                    conn!!.close()
                }
                catch (sqlEx :SQLException) {
                    sqlEx.printStackTrace()
                }

                conn = null
            }*/
        }

        // Total Count
        var sqltot = sql.split("LIMIT")[0]
        stmt = conn!!.createStatement()
        if (stmt!!.execute(sqltot)) {
            resultset = stmt.resultSet
        }
        var ntot = 0
        while (resultset!!.next()) {
            ntot++
        }

        var jsonObj = JSONObject()
        jsonObj.put("ncol",ncol)
        jsonObj.put("nrow",nrow)
        jsonObj.put("ntot",ntot)
        jsonObj.put("rows",jsonArray)

        // DEBUG
//        Util.log(sql)
//        Util.log(jsonObj.toString()+'\n')

        return(jsonObj)
    }

    // CRUD
    fun crud(sql: String): JSONObject {

        var stmt: Statement? = null
        var jsonObj = JSONObject()
        try {
            stmt = conn!!.createStatement()
            stmt.execute(sql)
            jsonObj.put("nins",1)
        }
        catch (ex: SQLException) {
            ex.printStackTrace()
            jsonObj.put("nins",0)
        }

        // DEBUG
        Util.log(sql)
        Util.log(jsonObj.toString()+'\n')
        return(jsonObj)
    }

    @JvmStatic
    fun main(args: Array<String>) {
        DB.getConnection("root","root")
        val jobj = DB.select("Select cat,own,due FROM pgm.wrk", "String,String,Date")
        println(jobj)

    }
}