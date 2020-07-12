/** Type Class class is a type system construct that supports ad hoc
 *  polymorphism. This is achieved by adding constraints to type
 *  variables in parametrically polymorphic types. Such a constraint
 *  typically involves a type class T and a type variable a, and means
 *  that a can only be instantiated to a type whose members support the
 *  overloaded operations associated with T.
 *  The keyword out is necessary as otherwise line 22 will
 *  throw a type mismatch error at compile time
 */
sealed class TC<out A> {

//    object None: TC<Nothing>()
    /** Value is actually a data class DC and
     *  value is dc i.e., an instance of the data class DC and
        extends the type class TC as below
     */
    data class Value<out A>(val value: A): TC<A>()

    /** Apply a function to a wrapped data, i.e. a type class
        and return a wrapped data using flatMap
        (liftM or >>= in Haskell)
     */
    inline infix fun <B> flatMap(f: (A) -> TC<B>): TC<B> = when (this) {
//        is None  -> this
        is Value -> f(value)
    }
}
