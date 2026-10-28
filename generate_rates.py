import json
# Transcribed against uploaded PullSheet(1).xls, Sheet1 A4:A40 and H/I.
# Source nomenclature is preserved, even where two apparently similar items have different rates.
data = [
 (4,'250 Rolled Curb','Curbs', 'lm',.115,None),
 (5,'250 Rolled Curb on Asphalt','Curbs', 'lm',.096,None),
 (6,'250 Std. Curb','Curbs', 'lm',.103,None),
 (7,'250 Std. Curb on Asphalt','Curbs', 'lm',.088,None),
 (8,'250 Std. Curb Crossing: 1 Foot Back','Curbs', 'lm',.148,None),
 (9,'500 Rolled Curb','Curbs', 'lm',.141,None),
 (10,'500 Rolled Curb on Asphalt','Curbs', 'lm',.117,None),
 (11,'500 Std. Curb','Curbs', 'lm',.152,None),
 (12,'500 Std. Curb on Asphalt','Curbs', 'lm',.126,None),
 (13,'500 Std. Curb Crossing: 1 Foot Back','Curbs', 'lm',.197,None),
 (14,'1.1 Rolled Mono','Monolithic walks','lm',.214,.2415),
 (15,'1.1 Rolled Mono Crossing','Monolithic walks','lm',.271,None),
 (16,'1.5 Rolled Mono','Monolithic walks','lm',.254,.2915),
 (17,'1.5 Rolled Mono Crossing','Monolithic walks','lm',.338,None),
 (18,'2.0 Rolled Mono','Monolithic walks','lm',.304,.354),
 (19,'2.0 Rolled Mono Crossing','Monolithic walks','lm',.413,None),
 (20,'1.21 Std. Mono','Monolithic walks','lm',.211,.24125),
 (21,'1.21 Std. Mono Crossing','Monolithic walks','lm',.272,None),
 (22,'1.41 Std. Mono','Monolithic walks','lm',.224,None),
 (23,'1.61 Std. Mono','Monolithic walks','lm',.251,.29125),
 (24,'1.61 Std. Mono Crossing','Monolithic walks','lm',.332,None),
 (25,'2.0 Rld. Mono','Monolithic walks','lm',.303,None),
 (26,'2.1 Std. Mono','Monolithic walks','lm',.301,.3535),
 (27,'2.1 Std. Mono Crossing','Monolithic walks','lm',.407,None),
 (28,'Separate Walk, Flag and Median Fill','Separate walks & slabs','m2',.100,.125),
 (29,'Separate Walk, Flag and Median Fill Commercial','Separate walks & slabs','m2',.150,None),
 (30,'600mm Drainage Swale','Swales & aprons','lm',.145,None),
 (31,'Deep Gutter Swale','Swales & aprons','lm',.214,None),
 (32,'Specialized Deep Swale','Swales & aprons','lm',.157,None),
 (33,'1m Swale','Swales & aprons','lm',.238,None),
 (34,'1.4m S/W','Separate walks & slabs','lm',.140,.175),
 (35,'1.2m S/W','Separate walks & slabs','lm',.120,.150),
 (36,'1.5m S/W','Separate walks & slabs','lm',.150,.1875),
 (37,'2.0m S/W','Separate walks & slabs','lm',.200,.250),
 (38,'1.4m S/W xing','Separate walks & slabs','lm',.210,None),
 (39,'1.2 S/W xing','Separate walks & slabs','lm',.180,None),
 (40,'Truck apron','Swales & aprons','lm',.225,None),
]
items=[]
for source_row,name,cat,unit,rate100,rate125 in data:
    for thickness,rate in ((100,rate100),(125,rate125)):
        if rate is None: continue
        # Mark a thickness only where the source explicitly offers both options.
        t=thickness if rate125 is not None else None
        label=name + (f' — {thickness} mm' if t else '')
        items.append({'id':f'r{source_row}-{thickness}', 'name':name, 'label':label,'category':cat,'unit':unit,'thickness':t,'rate':rate, 'sourceRow':source_row})
with open('/mnt/data/marmot-pour-app/structures.js','w') as f:
    f.write('// Source: uploaded PullSheet(1).xls, Sheet1; source rows preserved.\n')
    f.write('window.MARMOT_PULL_RATES = '+json.dumps(items,ensure_ascii=False,indent=2)+';\n')
with open('/mnt/data/marmot-pour-app/pull-rates.json','w') as f:
    json.dump(items,f,ensure_ascii=False,indent=2)
print('structures',len(data),'dropdown',len(items), '2-thickness',sum(x[5] is not None for x in data))
