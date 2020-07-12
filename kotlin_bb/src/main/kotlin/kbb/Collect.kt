package kbb

object Collect {

    fun collect(list1: MutableList<String>, lis2: MutableList<String>): MutableList<String> {

        return mutableListOf()
    }


    @JvmStatic
    fun main(args: Array<String>) {

        val rowA0 =  mutableListOf<String>("I0","A0","B0","C0")
        val rowA1 =  mutableListOf<String>("I1","A1","B1","C1")
        val rowA2 =  mutableListOf<String>("I2","A2","B2","C2")

        var rowsA = mutableListOf<MutableList<String>>()
        rowsA.add(rowA0)
        rowsA.add(rowA1)
        rowsA.add(rowA2)


        val rowB0 =  mutableListOf<String>("I1","X0","Y0","Z0")
        val rowB1 =  mutableListOf<String>("I2","X1","Y1","Z1")

        var rowsB = mutableListOf<MutableList<String>>()
        rowsB.add(rowB0)
        rowsB.add(rowB1)

        var keys = mutableListOf<String>()
        for (r in rowsB) {
            keys.add(r.get(0))
        }
        println(keys)


        var result = mutableListOf<MutableList<String>>()
        rowsA.map { it ->
            if (it.get(0) in keys) {
                result.add(it)
            }
        }

        println(result)

    }
}