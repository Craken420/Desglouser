let obj ={}
 obj['obj1'] = 'loc1'
 obj['obj2'] = 'loc2'
 obj['obj3'] = 'loc3'

let obj2 ={}
 obj2['obj1'] = 'ola2'
 obj2['obj2'] = 'ola3'
 obj2['obj4'] = 'ola4'

 let obj3 ={}
 obj3['obj1'] = 'adios1'
 obj3['obj2'] = 'adios2'
 obj3['obj4'] = 'adios3'

let obj4 = {}
 obj4['objs'] = obj
 obj4['objs2'] = obj2
 obj4['objs3'] = obj3
 
 console.log(obj4)

for (key in obj4) {
    for (key2 in obj4[key]) {
        if (key2 == 'obj3') {
            delete obj4[key][key2]
        }
    }
}
console.log('---------------------------------------\n')
console.log(obj4)