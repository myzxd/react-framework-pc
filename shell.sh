#! /bin/bash
# 生成项目的目录结构
# 必须显示完整的目录，文件头部内容才能写入到指定的文件中
# 配合tree命令使用,可以生成文件树，通过tree生成一个文档，读取这个文档中的目录内容，进行生成代码，
# 目录内容，必须是全的 例子： tree -f > README.md

# 读取routes 目录并生成README文档
env=$1
routesPath='./src/routes';
backHomePath='../../';
# 获取目录下所有的文件
function ergodic ()
{
    # $1 表示函数的第一个参数
    # ##*./ 表示从左边开始删除最后（最右边）一个 ./ 号及左边的所有字符
    file_path=${1##*./} # 删除文件路径左边的所有字符
    file="$path/$file_path" # 拼接路径
    left_name=${1%'./'*} # 获取字符串./左边的内容
    right_name=${1##*'/'} # 获取字符串/右边的内容
    name="$left_name$right_name" # 拼接字符串

    # 判断文件
    if test -f $file
    then

        # 判断文件存在并且文件大小大于0 
        if [ -s $file ]
        then

            # 判断文件的后缀名
            if [[ "${file##*.}" = "js" || "${file##*.}" = "jsx" ]] 
            then

                # 读取文件第二行的内容
                title=$(awk "NR==2" $file)
                # ${title##*'*'} 读取*（星号）后面的内容
                # 判断title是否包含 *
                if [[ $title =~ '*' ]] 
                then 
                    echo "$name" "${title##*'*'}" >> $README # 写入文件

                else
                    echo "$name" "该文件没有头部注释或格式不对" >> $README # 写入文件
                fi

            # 样式
            elif [[ "${file##*.}" = "css" || "${file##*.}" = "less" ]]
            then

                echo "$name" '样式' >> $README # 写入文件

            # 静态文件
            elif [[ "${file##*.}" = "jpg" || "${file##*.}" = "png" ]]
            then

                echo "$name" '静态文件' >> $README # 写入文件

            # josn文件
            elif [ "${file##*.}" = "json" ]
            then

                echo "$name" 'json文件' >> $README # 写入文件

            else

                echo "$name" >> $README # 写入文件
            fi
        # 文件为空时
        else

            echo "$name" '该文件为空，请及时查看' >> $README # 写入文件
        fi
    # 判断目录
    elif test -d $file

    then
        echo "$name" >> $README # 写入文件
    # 判断文件是否存在
    elif [[ $file =~ 'directories' || $file =~ 'files' ]] 

    then
        echo "$name" >> $README # 写入文件
    else
        # echo "$name" >> $README # 写入文件
        echo "$name" '该文件不存在，请及时更新目录模版文件' >> $README # 写入文件

    fi
}

# 读取目录模版
function read_files () {
    path=$routesPath # 当前目录
    template="$path/README.md" # 目录模版
    echo '' > $README # 清空文件
    # while 读取文件每一行的内容
    while read line
    do
        ergodic "$line" # 函数调用

    done < $template
    
}



# 写入html模版
function write_html () {

    html_template="./doc/source/index.html" # html模版
    html=`cat $html_template` # 读取模版内容
    left_pre='<pre style="width: 100%; overflow-x: auto; height: 3200px;">'
    right_pre='</pre>'

    # 判断html模版是否包含 $left_pre
    if [[ $html =~ $left_pre ]]
    then
        echo 'html模版已经有内容了，不需要在进行插入了'
    else
        sed -i '' '/h1/a\
        '"$left_pre"'' $html_template # 在h1后面插入 $left_pre
        sed -i '' '/<pre/a\
        '"$right_pre"'' $html_template # 在<pre后面插入 $right_pre
        sed -i '' "/<pre/r "${README} $html_template # 在<pre后面插入 $text(内容)

    fi
}


if [ $env == "oa" ]
then
  routesPath='./src/routes/oa/document';
  backHomePath='../../../../';
  README="$routesPath/OAREADME.md" # 写入文件
  cd $routesPath
  tree -f > README.md
  cd $backHomePath
  read_files
elif [ $env == "boss" ]
then
  routesPath='./src/routes';
  backHomePath='../../';
  README="./doc/project/README.md" # 写入文件
  cd $routesPath
  tree -f > README.md
  cd $backHomePath
  read_files
  write_html
else
  echo "type error, not find"
fi

