data class DC (var data: Double, var rem: String)       // data structure

fun mysqrt(a: DC) = when {
    helper(a) -> {
        var y = kotlin.math.sqrt(a.data)
        a.data = y
        a.rem = a.rem + "mysqrt ok\n"
        println(y)
        TC.Value(a)
    }
    else -> {
//        TC.Value(DC(0.0,"Error: Number is negative"))
        a.data = 0.0
        a.rem = a.rem + "mysqrt Error: Argument is negative\n"
        TC.Value(a)
    }
}

fun mylog(a: DC) = when {
    a.data > 0  -> {
        var y: Double = kotlin.math.ln(a.data)
        a.data = y
        a.rem = a.rem + "mylog ok\n"
        println(y)
        TC.Value(a)
    }
    else -> {
        a.data = 0.0
        a.rem = a.rem + "mylog Error: Argument is 0; "
        TC.Value(a)
    }
}

fun myinv(a: DC) = when {
    a.data > 0 -> {
        var y: Double = 1/(a.data)
        a.data = y
        a.rem = a.rem + "myinv ok\n"
        println(y)
        TC.Value(a)
    }
    else -> {
//        TC.Value(DC(0.0,"Error: Number is 0"))
        a.data = 0.0
        a.rem = a.rem + "myinv Error: Denominator is 0; "
        TC.Value(a)
    }
}


fun ioFunction(a: DC): Unit {

    // populate data instance a

}



fun helper(a: DC): Boolean {

    when (a.data) {
        0.0 -> { return true }
    }

    if (a.data > 0)
        return true

    return false
}



