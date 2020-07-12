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