[getList]
SELECT * FROM sreaccount WHERE title LIKE $P{searchtext} ORDER BY title 

[getListByParentid]
SELECT * FROM sreaccount WHERE parentid=$P{parentid} AND title LIKE $P{searchtext} ORDER BY title 

[findByCode]
SELECT * FROM sreaccount WHERE code=$P{code} 
