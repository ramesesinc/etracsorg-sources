[getMembers]
SELECT 
	lgucode, lguname, lgudesc, state, 
	CASE 
		WHEN logo IS NULL THEN 0 
		ELSE 1 
	END AS haslogo 
FROM members 
HAVING haslogo=1 
ORDER BY lguname

[getActiveMembers]
SELECT 
	lgucode, lguname, lgudesc, state, 
	CASE 
		WHEN logo IS NULL THEN 0 
		ELSE 1 
	END AS haslogo 
FROM members 
WHERE state='ACTIVE' 
HAVING haslogo=1 
ORDER BY lguname 

[findMember]
SELECT * FROM members WHERE regno=$P{regno}

[findMemberByCode]
SELECT * FROM members WHERE lgucode=$P{lgucode}

[findMemberByName]
SELECT * FROM members WHERE lguname=$P{lguname}
