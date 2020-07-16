import  os

path = '/Users/jganguly/Sites/josh/ktfas/fas/module/'

def gentable() :    # All tables MUST have pmk, on click of Sel it populates pmk in inpName which is always present as tbx or hid

    mod     = "rul"
    title   = "Rule ID, IF,  THEN, rem, pmk"
    colName = "rid,     ant, con,  rem, pmk" # pmk MUST be last
    w       = "10%,     55%, 35%,  0%,  0%"
    a       = "C,       L,   L,    L,   L"
    gentableUtil(mod,title,colName,w,a,8+1)

    mod     = "cfg"
    title   = "Config ID, Key, Value, pmk"
    colName = "cid,       att, val,   pmk" # pmk MUST be last
    w       = "10%,       45%, 45%,   0%"
    a       = "C,         L,   L,     L"
    gentableUtil(mod,title,colName,w,a,15+1)

    mod     = "bdg"
    title   = "Binding ID, Symbol, URL End Point, pmk"
    colName = "bid,        sym,    url,           pmk" # pmk MUST be last
    w       = "10%,        25%,    65%,           0%"
    a       = "C,          L,      L,             L"
    gentableUtil(mod,title,colName,w,a,15+1)

    mod     = "dat"
    title   = "Data Set ID, Attribute, Value, pmk"
    colName = "bid,      att,       val,   pmk" # pmk MUST be last
    w       = "10%,      60%,       30%,   0%"
    a       = "C,        L,         L,     L"
    gentableUtil(mod,title,colName,w,a,15+1)

    mod     = "out"
    title   = "Data Set ID, Attribute, Value, pmk"
    colName = "bid,       att,       val,   pmk" # pmk MUST be last
    w       = "10%,       60%,       30%,   0%"
    a       = "C,         L,         L,     L"
    gentableUtil(mod,title,colName,w,a,16+1)

    mod     = "log"
    title   = "Data Set ID, Rule ID, If,  Then, Result, pmk"
    colName = "bid,         rid,     ant, con,  res,    pmk" # pmk MUST be last
    w       = "8%,          12%,     48%, 25%,  6%,     0%"
    a       = "C,           C,       L,   L,    C,      L"
    gentableUtil(mod,title,colName,w,a,16+1)

    mod     = "val"
    title   = "Ant/Con, Cond, Status, Data Type, pmk"
    colName = "aoc,     cnd,  sta,    typ,       pmk" # pmk MUST be last
    w       = "10%,     70%,  10%,    10%,       0%"
    a       = "C,       L,    C,      C,         L"
    gentableUtil(mod,title,colName,w,a,16+1)

    mod     = "usr"
    title   = "User ID, Role, pmk"
    colName = "oid,     rol,  pmk" # pmk MUST be last
    w       = "50%,     50%,  0%"
    a       = "L,       L,    L"
    gentableUtil(mod,title,colName,w,a,15+1)


def gentableUtil(mod,t,c,w,a,nrow) :     # Do not change anything in this function

    # Create pList
    t   = t.split(',');
    c   = c.split(',');
    w   = w.split(',');
    a   = a.split(',');
    print mod, len(t), len(c), len(w), len(a),

    for i in range (0, len(w)) :
        t[i] = t[i].strip()
        c[i] = c[i].strip()
        w[i] = w[i].strip()
        a[i] = a[i].strip()

    x = []
    x.append('Sel'); x.append(''); x.append('03%'); x.append('C');
    for i in range (0, len(t)) :
        x.append(t[i]); x.append(c[i]); x.append(w[i]); x.append(a[i]);
    pList = x


    # HTML Table
    fh = open(path + '/' + mod + '/' + mod + '_table.html','w')

    sumwidth = 0;

    if mod != 'fup':
    #    fh.write('<div class="CLS_DIV_CEN">' + '\n')
       fh.write('<div class="CLS_DIV_TAB">' + '\n')
    else :
        fh.write('<div class="CLS_DIV_TAB" style="padding-left:20px;">' + '\n')
    fh.write('<table id="id_table" class="CLS_TBL" ><tr class="CLS_TBL_HDR" style="font-family:ubuntu">' + '\n\n')


    j = 0
    while j < len(pList) :          # Header Row
        t = pList[j]
        c = pList[j+1]
        w = pList[j+2]
        a = pList[j+3]

        if   ( ( w == "0%" ) or ( w == "00%" ) ) :
            v = 'hidden'
        else :
            v = 'visible'

        ac = ''

        if a == 'L':
            ac = 'class="TD_L"'
        elif a == 'C':
            ac = 'class="TD_C"'
        elif a == 'R':
            ac = 'class="TD_R"'

        sumwidth = sumwidth + float(w[:-1])

        print c,

        id_col = "'" + "id_col_" + str(j/4) + "'"
        # print id_hdr
        fh.write('<th id=' + id_col + ' ' + ac + ' width='+'"'+ w +'"' + ' onclick="sortColumn(\''+ c +'\');" ' + ' style="white-space:nowrap; vertical-align:center; visibility:' + v + '"' + ' title="Click to sort">' + t + '</th>' + '\n')

        j = j + 4

    fh.write('</tr>' + '\n\n')



    i = 0
    while i < nrow :                # All rows

        # fh.write('<tr class="CLS_TBL_ROW">' + '\n')

        if (i%2 == 0) :
            fh.write('<tr class="CLS_TBL_ROW" bgcolor="white">' + '\n')
        else :
            fh.write('<tr class="CLS_TBL_ROW" bgcolor="#ccffff">' + '\n')
            # fh.write('<tr class="CLS_TBL_ROW" bgcolor="#d9d9d9">' + '\n')


        if i == 0 :                     # Search Row
            j = 0
            while j < len(pList) :

                t = pList[j]
                c = pList[j+1]
                w = pList[j+2]
                a = pList[j+3]

                if   ( ( w == "0%" ) or ( w == "00%" ) ) :
                    v = 'hidden'
                else :
                    v = 'visible'

                if   a == 'L' :
                    ac = 'class="TD_L"'
                elif a == 'C' :
                    ac = 'class="TD_C"'
                elif a == 'R' :
                    ac = 'class="TD_R"'

                if (j == 0) :       # Col 0 is Checkbox
                    sHTML = '<td style="vertical-align:center; "' + ' align="left"><img id="id_img_clf" src="../../icon/clf.png" height="16" width="16-left" style="padding-left:4px;" onclick="clf();" ' + '/></td>'
                else :
                    if (v == 'visible') :
                        sHTML = '<td ' +  ac + ' style="white-space:nowrap; vertical-align:center; visibility:' + v + '"><div><input id="id_sea_'+str(j/4) + '"' + ' type="textbox" style="font-weight:bold; text-align:' + 'left' + '; width:99%; color:purple; font-size:1.0em;" onchange="sea();"/></div></td>'
                    elif (v == 'hidden') :
                        sHTML = '<td ' +  ac + '><div><input id="id_sea_'+str(j/4) + '"' + ' type="textbox" style="text-align:' + a + '; width:99%; color:purple; font-size:1.0em;" onchange="sea();"/> </div></td>'

                fh.write(sHTML + '\n')
                j = j + 4


        else :                          # Rows other than Search
            j = 0
            while j < len(pList) :

                t = pList[j]
                c = pList[j+1]
                w = pList[j+2]
                a = pList[j+3]

                if   ( ( pList[j+2] == "00%" ) or ( pList[j+2] == "0%" ) ) :
                    v = 'hidden'
                else :
                    v = 'visible'

                if   a == 'L' :
                    ac = 'class="TD_L"'
                elif a == 'C' :
                    ac = 'class="TD_C"'
                elif a == 'R' :
                    ac = 'class="TD_R"'

                td_id = 'id_td_' + str(i) +'_' + str(j/4)


                if (j == 0) :       # Col 0 is Checkbox
                    sHTML = '<td ' + 'id=' + '"' + td_id + '"' + ac + '><input style="height:10px; white-space:nowrap; vertical-align:center; visibility:hidden;" type="checkbox" id="id_cbx_' + str(i-1) + '" name="cbx_' + str(i-1) + '" disabled>' + ' </td>'       #onclick="selRow()"
                else :
                    sHTML = '<td ' + 'id=' + '"' + td_id + '"' + ac + ' width='+'"'+ w +'"' + ' style="line-height:10px; font-weight:bold; white-space:nowrap; overflow:hidden; visibility:' + v + '" ' + ' onClick=selRow(' + str(i) + '); >'

                # print sHTML
                # raw_input()

                fh.write(sHTML + '\n')
                j = j + 4

        fh.write('</tr>' + '\n')
        i += 1

    fh.write('\n</table>' + '\n')
    fh.write('</div>' + '\n\n')

    fh.close()
    print sumwidth










if __name__ == '__main__':
    gentable()
    # raw_input()

