import {headers} from 'next/headers'
import Link from 'next/link'

const EmailInvite = async ({name,businessName,id}: {name: string,businessName: string,id: string}) => {

    const head = await headers()

    const host = head.get('host')
    console.log(host)


    return <>
        <div>
        
            <div>
                <span style={{fontWeight: 'bold'}}>Hello!</span> <br/>
                <span>{name} has invited you to join {businessName}</span>
            </div>
            <a href={`https://${host}/api/business/join?id=${id}`}>Accept Invite</a>
            

        </div>
    
    </>
}


export default EmailInvite;