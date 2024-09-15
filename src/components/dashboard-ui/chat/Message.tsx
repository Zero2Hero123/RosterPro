




interface Props {
    content: string;
    businessId: string;
    authorId: string;
    createdAt: Date;
}



const Message = ({content,authorId}: Props) => {

    return <div className="flex justify-start">

        <div className="bg-slate-800 text-white p-3 rounded-lg text-sm">
            <span>{authorId}</span>
            <span>{content}</span>
        </div>

    </div>
}


export default Message;