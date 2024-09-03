
const EmailInvite = ({name,businessName,id}: {name: string,businessName: string,id: string}) => {


    return <>
        <div>
        
            <div>
                <span style={{fontWeight: 'bold'}}>Hello!</span> <br/>
                <span>{name} has invited you to join {businessName}</span>
            </div>
            <a href={`${process.env.HOST}/api/business/join?id=${id}`}>Accept Invite</a>
            

        </div>
    
    </>
}


export default EmailInvite;