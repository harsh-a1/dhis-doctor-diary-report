exports.DHIS_URL_BASE = "https://uphmis.in/uphmis";
exports.username = "admin";
exports.password = "";

exports.program_doc_diary = "Bv3DaiOd5Ai";
exports.root_ou = "v8EzhiynNtf";
exports.attr_user = "fXG73s6W4ER";


exports.views = {
    login : "login",
    calendar : "calendar",
    entry : "entry",
    loading : "loader",
    settings: "settings"
};

exports.approval_status = {

    approved : "Approved",
    autoapproved : "Auto-Approved",
    rejected : "Rejected",
    resubmitted : "Re-submitted",
    pending2 : "Pending2",
    pending1 : "Pending1"
    
}

exports.approval_usergroup_level2_code="approval2ndlevel";
exports.approval_usergroup_level1_code="approval1stlevel";

exports.report_types = {

    approved: "approved",
    pending:"pending",
    rejected : "rejected"
}

exports.approval_status_de = "W3RxC0UOsGY";
exports.approval_rejection_reason_de = "CCNnr8s3rgE";

exports.attr_releiving_date = "mE6SY3ro53v";
exports.query_ddReport = function(ps,ou,sdate,edate){

    return `
            
select 
pi.trackedentityinstanceid,
max(psiou.uid) as psiouuid,
max(ou.uid) as ouuid,
max(ou.name) as facility,
max(block.name) as block,
max(district.name) as district,
max(division.name) as division,
array_agg(distinct concat(tea.uid,':',teav.value)) as attrlist,
array_agg(distinct concat(de,':',devalue)) as delist
from programinstance pi
left join (
	select tei.organisationunitid,pi.trackedentityinstanceid as tei,de.uid as de,sum(tedv.value::float8) as devalue
	from programstageinstance psi
	inner join programinstance pi on pi.programinstanceid = psi.programinstanceid
	inner join trackedentitydatavalue tedv on tedv.programstageinstanceid = psi.programstageinstanceid
	inner join dataelement de on de.dataelementid = tedv.dataelementid
	inner join trackedentityinstance tei on tei.trackedentityinstanceid = pi.trackedentityinstanceid
	where tedv.value ~ '^-?[0-9]+.?[0-9]*$' and tedv.value !='0'
	and de.valuetype = 'NUMBER'
	and psi.executiondate between '${sdate}' and '${edate}'
	and psi.programstageid in (select programstageid 
								from programstage 
								where uid = '${ps}')
	and tei.organisationunitid in (select organisationunitid 
									from organisationunit 
									where path like '%${ou}%')
	group by pi.trackedentityinstanceid,de.uid,tei.organisationunitid
	
	union
	select tei.organisationunitid,pi.trackedentityinstanceid as tei,
tedv.value,count(tedv.value)
	from programstageinstance psi
	inner join programinstance pi on pi.programinstanceid = psi.programinstanceid
	inner join trackedentitydatavalue tedv on tedv.programstageinstanceid = psi.programstageinstanceid
	inner join dataelement de on de.dataelementid = tedv.dataelementid
	inner join trackedentityinstance tei on tei.trackedentityinstanceid = pi.trackedentityinstanceid
	and psi.executiondate between '${sdate}' and '${edate}'
	and de.uid in ('x2uDVEGfY4K')
	and psi.programstageid in (select programstageid 
								from programstage 
								where uid = '${ps}')
	and tei.organisationunitid in (select organisationunitid 
									from organisationunit 
									where path like '%${ou}%')
	group by pi.trackedentityinstanceid,de.uid,tei.organisationunitid,tedv.value
)tedv
on pi.trackedentityinstanceid = tedv.tei
right join trackedentityattributevalue teav on pi.trackedentityinstanceid = teav.trackedentityinstanceid
inner join trackedentityattribute tea on tea.trackedentityattributeid = teav.trackedentityattributeid
inner join organisationunit ou on ou.organisationunitid = pi.organisationunitid
left join organisationunit psiou on psiou.organisationunitid = tedv.organisationunitid
left join organisationunit block on ou.parentid = block.organisationunitid
left join organisationunit district on block.parentid = district.organisationunitid
left join organisationunit division on district.parentid = division.organisationunitid
inner join 
(
	select distinct teav.trackedentityinstanceid,ps.name as speciality
	from programstageusergroupaccesses psuga
	inner join programstage ps on ps.programstageid = psuga.programid
	inner join usergroupaccess uga on uga.usergroupaccessid = psuga.usergroupaccessid
	inner join usergroup ug on ug.usergroupid = uga.usergroupid
	inner join usergroupmembers ugm on ugm.usergroupid = ug.usergroupid
	inner join users u on u.userid = ugm.userid
	inner join trackedentityattributevalue teav on teav.value = u.username
	where psuga.programid in (select programstageid 
				from programstage 
				where uid = '${ps}' 	)
	group by u.username,teav.trackedentityinstanceid,ps.name
)filteredusers
on filteredusers.trackedentityinstanceid = pi.trackedentityinstanceid
inner join trackedentityinstance tei on tei.trackedentityinstanceid = pi.trackedentityinstanceid
inner join trackedentitytype tet on tei.trackedentitytypeid = tet.trackedentitytypeid
where tet.uid = 'lI7LKVfon5c'
group by pi.trackedentityinstanceid,division.organisationunitid,district.organisationunitid,block.organisationunitid,ou.name
order by division.name,district.name,block.name,ou.name


`

}


exports.cache_curr_user = "dd_current_user";
exports.cache_user_prefix = "dd_user_";
exports.cache_program_metadata = "dd_program_metadata";

exports.disabled_fields = [
    'OZUfNtngt0T',
    'CCNnr8s3rgE'
];

exports.required_fields = [
    'x2uDVEGfY4K'
]

exports.query_jsonize = function(q){
    return `select json_agg(main.*) from (
            ${q}
            
        )main`;
}
