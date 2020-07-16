// https://www.tutorialkart.com/kotlin/connect-to-mysql-database-from-kotlin-using-jdbc/
/**
@author    Jaideep Ganguly
@since     03/20/2018
 */

package svr

import org.json.simple.JSONArray
import org.json.simple.JSONObject
import java.sql.*
import java.util.Properties


object ServerDB {

    internal var conn :Connection? = null
    internal var username = "root" // provide the username
    internal var password = "root" // provide the password

    // SELECT
    fun select(sql :String, typ :String) : JSONObject {

        var acol = sql.split("SELECT")[1].split("FROM")[0].split(",")
        var colName :Array<String> = Array( acol.size, { it -> " " })
        for (i in 0..acol.size-1) {
            colName.set(i,acol[i].trim(' '))
//            println(colName.get(i))
        }

        var atyp = typ.split(",")
        var colTyp = Array(atyp.size, {i -> ""})

        for (i in 0 .. colTyp.size-1) {
            colTyp.set(i,atyp[i].trim())
        }

        var stmt        :Statement? = null
        var resultset   :ResultSet? = null

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
                    if (colTyp.get(i).compareTo("Int") == 0) {
                        col[i] = resultset.getInt(i + 1).toString()
                    }
                    else if (colTyp.get(i).compareTo("String") == 0) {
                        col[i] = resultset.getString(i + 1).toString()
                    }
                    else if (colTyp.get(i).compareTo("Float") == 0) {
                        col[i] = resultset.getFloat(i + 1).toString()
                    }
                    else if (colTyp.get(i).compareTo("Date") == 0) {
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
    fun crud(sql :String) :JSONObject {

        var stmt :Statement? = null
        var jsonObj = JSONObject()
        try {
            stmt = conn!!.createStatement()
            stmt.execute(sql)
            jsonObj.put("nins",1)
        }
        catch (ex :SQLException) {
            ex.printStackTrace()
            jsonObj.put("nins",0)
        }

        // DEBUG
        Util.log(sql)
        Util.log(jsonObj.toString()+'\n')
        return(jsonObj)
    }

    // DB Connection
    fun getConnection() {

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

}
