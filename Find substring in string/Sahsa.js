code = process.argv[2];
filenamestr = process.argv[3];
filenamesub = process.argv[4];
const { count } = require('console');
var fs = require('fs');
const { start } = require('repl');

var str = fs.readFileSync(filenamestr,"utf-8").toString();
var sub = fs.readFileSync(filenamesub,"utf-8").toString();

if (sub.length > str.length)
{
    process.exit();
}

if (code == "-bf")
{
    st = performance.now();

    if (sub.length == str.length)
    {
        for(var i = 0; i < str.length; i++)
        {
            if (sub[i] != str[i])
            {
                process.exit();
            }
        }

        end = performance.now();
        console.log(end - st,1,[0]);
        process.exit();
    }

    quan = 0;
    indexs = [];

    for (var i = 0; i < str.length-sub.length+1; i++)
    {
        cnt = 1;

        if (str[i] == sub[0])
        {
            for (var j = 1; j < sub.length; j++)
            {
                if (str[i+j] != sub[j])
                {
                    break;
                }
                else
                {
                    cnt++;
                }
            }

            if (cnt == sub.length)
            {
                if (indexs.length < 10)
                {
                    indexs[quan++] = i;
                }
                else
                {
                    quan++;
                }

                i += sub.length - 1;
            }
        }
    }

    end = performance.now();

    console.log(end-st,quan,indexs);
}

if (code == "-hs")
{
    function HashSum(strng)
    {
        hashsum = 0;

        for  (var i = 0; i < strng.length; i++)
        {
            hashsum += strng[i].charCodeAt(0);
        }

        return hashsum;
    }

    st = performance.now();

    if (sub.length == str.length)
    {
        for(var i = 0; i < str.length; i++)
        {
            if (sub[i] != str[i])
            {
                process.exit();
            }
        }

        end = performance.now();
        console.log(end - st,1,[0]);
        process.exit();
    }

    hashsub = HashSum(sub);

    quan = 0;
    indexs = [];

    for (var i = 0; i < str.length-sub.length+1; i++)
    {
        if (hashsub == HashSum(str.slice(i,i+sub.length)))
        {
            if(indexs.length < 10)
            {
                indexs[quan++] = i;
                i += sub.length - 1;
            }
            else
            {
                quan++;
                i += sub.length - 1;
            }
        }
    }
    
    end = performance.now();

    console.log(end-st,quan,indexs);
}

if (code == "-rk")
{
    
    function HashSumRK(strng)
    {
        hashsum = 0;
        coeff = 1;

        for  (var i = 0; i < strng.length; i++)
        {
            hashsum += strng[i].charCodeAt(0)*coeff;
            coeff = coeff*2;
        }

        return hashsum;
    }

    st = performance.now();

    if (sub.length == str.length)
    {
        for(var i = 0; i < str.length; i++)
        {
            if (sub[i] != str[i])
            {
                process.exit();
            }
        }

        end = performance.now();
        console.log(end - st,1,[0]);
        process.exit();
    }

    hashsub = HashSumRK(sub);

    quan = 0;
    indexs = [];

    for (var i = 0; i < str.length-sub.length+1; i++)
    {
        if (hashsub == HashSumRK(str.slice(i,i+sub.length)))
        {
            if(indexs.length < 10)
            {
                indexs[quan++] = i;
                i += sub.length - 1;
            }
            else
            {
                quan++;
                i += sub.length - 1;
            }
        }
    }
    
    end = performance.now();

    console.log(end-st,quan,indexs);
}