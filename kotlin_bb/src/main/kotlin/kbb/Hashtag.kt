package kbb

object Hashtag {

    fun hashTagToWords(hashTag: String, dictWords: Set<String>): MutableList<String> {
        var found = mutableListOf<String>()
        found = recurse(hashTag, dictWords, 0, found) as MutableList<String>
        return found
    }

    fun recurse(hashTag: String, dictWords: Set<String>, startPos: Int, breakUp: MutableList<String>): MutableList<String> {
        val endPos = hashTag.length - 1
        var paramList = breakUp

        if (startPos == endPos) {
            paramList.addAll(breakUp)
            return paramList
        }

        for (i in startPos..endPos) {
            val curPossibleWord = hashTag.substring(startPos, i + 1)
            if (!dictWords.contains(curPossibleWord)) {
                continue
            }

            paramList.add(curPossibleWord)
            println("${curPossibleWord} ${breakUp}")
            recurse(hashTag, dictWords, i + 1, paramList)
        }

        return paramList
    }

    @JvmStatic
    fun main(args: Array<String>) {
        val found = hashTagToWords(
            "bindrawinsgold",
            setOf("i", "you", "bindra", "gold", "silver", "wins", "love")
        )
        println(found)
    }
}