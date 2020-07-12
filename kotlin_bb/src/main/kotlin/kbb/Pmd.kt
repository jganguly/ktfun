package kbb

import java.io.File
import java.nio.file.FileSystem
import java.nio.file.FileSystems
import java.nio.file.Files
import java.nio.file.StandardCopyOption

object Pmd {    // Process Markdown

    fun process(inputMD: String) {

//        val outputMD = inputMD.split(".md")[0] + "Kt.md"
        val outputMD = "/tmp/kbbKt.md"

        File(outputMD).printWriter().use { out ->

            File(inputMD).forEachLine { it ->

                // line contains a file name with start and end line numbers
                if (it.contains("<!--")) {
                    val line = it.split("<!--")[1].split("-->")[0]

                    val aline = line.split(" ")

                    val ktFile = aline[0]

                    val start: Int
                    val end: Int

                    if (aline.size == 1) {
                        start = 1
                        end = Int.MAX_VALUE
                    } else {
                        start = aline[1].toInt()
                        end = aline[2].toInt()
                    }

                    var lineno = 1
                    out.println("```kotlin")
                    File(ktFile).forEachLine { kt ->
                        if ((lineno >= start) && (lineno <= end)) {
                            out.println(kt)
                        }
                        lineno++
                    }
                    out.println("```")
                } else {
                    out.println(it)
                }
            }
        }
    }

    @JvmStatic
    fun main(args: Array<String>) {

        println("Welcome to markdown processor\n")
        if ( args.size != 1 ){
            // java -jar /Users/jaideep.ganguly/jg-josh/kotlin_bb/build/libs/kotlin_bb-all.jar /Users/jaideep.ganguly/jg-josh/kotlin_wiki/kbb.md
            println("Usage : file_name_with_path.md")
            return
        }
//        process(args[0])
        process("/Users/jaideep.ganguly/Sites/wiki/kbb.md")

        Files.move(
            FileSystems.getDefault().getPath("/tmp/kbbKt.md"),
            FileSystems.getDefault().getPath("/Users/jaideep.ganguly/Sites/wiki/kbbKt.md"),
            StandardCopyOption.REPLACE_EXISTING)
    }
}