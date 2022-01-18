[getList]
SELECT * FROM account WHERE title LIKE $P{searchtext} ORDER BY title 

[getListByParentid]
SELECT * FROM account WHERE parentid=$P{parentid} AND title LIKE $P{searchtext} ORDER BY title 

[findByCode]
SELECT * FROM account WHERE code=$P{code} 
