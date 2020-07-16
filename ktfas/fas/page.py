path = '/Users/jganguly/Sites/josh/ktfas/fas/module/'

fw = None

def page(mod,title,menu,table) :    
    global fw

    fw = open(path+mod+'/'+mod+'.html','w')

    fw.write('<!DOCTYPE html>\n')
    fw.write('<html>\n\n')

    head(mod,title)
    body(mod,menu,table)

    fw.write('</html>\n')
    fw.close()
 

def head(mod,title):
    fw.write('<head>\n')
    fw.write('    <meta charset="UTF-8" content="width=device-width, initial-scale=1.0">\n')

    fw.write('    <title>' + title + '</title>\n\n')

    # jQuery & googleapis
    fw.write('    <script  type="text/javascript"                   src ="/static/libjs/jquery.js">                           </script>\n')
    fw.write('    <script  type="text/javascript"                   src ="/static/libjs/jquery-ui-1.11.4/jquery-ui.js">       </script>\n')
    fw.write('    <script  type="text/javascript"                   src ="/static/libjs/json-viewer/json-viewer.js">          </script>\n')

    fw.write('    <link    type="text/css"    rel="stylesheet"      href="/static/libjs/jquery-ui-1.11.4/jquery-ui.css">\n\n')
    fw.write('    <link    type="text/css"    rel="stylesheet"      href="/static/libjs/json-viewer/json-viewer.css">\n\n')
    fw.write('    <link    rel="stylesheet"   type="text/css"       href="https://fonts.googleapis.com/css?family=Ubuntu">\n\n')

    # My js, css and icon
    fw.write('    <link    rel="stylesheet"        href="/static/css/style.css" type="text/css">\n')
    fw.write('    <link    rel="shortcut icon"     href="/static/icon/fab.png"   type="image/x-icon"/>\n\n')

    fw.write('    <script  type="text/javascript"  src="/static/libjs/common.js"></script>\n')
    fw.write('    <script  type="text/javascript"  src="' + '/static/module/' + mod + '/' + mod + '.js"></script>\n\n')

    fw.write('</head>\n\n\n\n')


def body(mod,menu,table):
        fw.write('<body style="height:100%;">\n\n')
        fw.write('    <div class="CLS_DIV_CEN">\n\n')

        if menu == 'menu':
            menuBar()

        fr = open (path + mod + '/' + mod + "_ctrl.html",'r')
        lines = fr.readlines()
        for line in lines:
            fw.write('    ' + line)
        fr.close()

        if table == 'table':
            fr = open (path + mod + '/' + mod + "_table.html",'r')
            lines = fr.readlines()
            for line in lines:
                fw.write('   ' + line)
            fr.close()

        fw.write('</div>\n\n')
        fw.write('</body>\n')


def menuBar(): 
        fw.write('    <div style="width:71%; margin:auto; border:0px solid red;" id="menu">\n')
        fw.write('        <ul style="width:100%;  border:0px solid cyan;" id="ul1">\n')

        # Rule
        fw.write('        <li>\n')
        fw.write('        <a href="../rul/rul.html"   target="_self">RULE</a>\n')
        fw.write('            <ul>\n')
        fw.write('            <a href="../cfg/cfg.html"   target="_self">CONFIG</a>\n')
        fw.write('            <a href="../bdg/bdg.html"   target="_self">BINDING</a>\n')
        fw.write('            <a href="../val/val.html"   target="_self">VALIDATE</a>\n')
        fw.write('            <a href="../jdd/jdd.html"   target="_self">DATA DEF</a>\n')
        fw.write('            </ul>\n')
        fw.write('        </li>\n')

        fw.write('        <li>\n')
        fw.write('        <a href="../dat/dat.html"   target="_self">DATA</a>\n')
        fw.write('        </li>\n')

        fw.write('        <li>\n')
        fw.write('        <a href="../inf/inf.html"   target="_self">EXECUTE</a>\n')
        fw.write('        </li>\n')

        fw.write('        <li>\n')
        fw.write('        <a href="../out/out.html"   target="_self">OUTPUT</a>\n')
        fw.write('            <ul>\n')
        fw.write('            <a href="../log/log.html"   target="_self">LOG</a>\n')
        fw.write('            </ul>\n')
        fw.write('        </li>\n')

        fw.write('        <li>\n')
        fw.write('        <a href="../usr/usr.html"   target="_self">USERS</a>\n')
        fw.write('            <ul>\n')
        fw.write('            <a href="../pwd/pwd.html"   target="_self">PASSWORD</a>\n')
        fw.write('            </ul>\n')
        fw.write('        </li>\n')

        fw.write('        <li>\n')
        fw.write('        <a href="../about/about.html"   target="_self">ABOUT</a>\n')
        fw.write('            <ul>\n')
        fw.write('            <a href="../logout/logout.html"   target="_self">LOGOUT</a>\n')
        fw.write('            </ul>\n')
        fw.write('        </li>\n')

        fw.write('        <ul>\n')
        fw.write('    </div>\n\n')


if __name__ == '__main__':
    #
    # module, title, menu/nomenu, table/notable
    #
    page('login','Login','nomenu','notable')

    page('rul','Rule','menu','table')
    page('cfg','Config','menu','table')
    page('bdg','Binding','menu','table')
    page('val','Validate','menu','table')
    page('jdd','Dictionary','menu','notable')

    page('dat','Data','menu','table')
    page('out','Output','menu','table')
    page('log','Log','menu','table')

    page('inf','Infer','menu','notable')

    page('usr','User','menu','table')
    page('pwd','Password','menu','notable')

    page('about','About','menu','notable')
    page('logout','Logout','nomenu','notable')
