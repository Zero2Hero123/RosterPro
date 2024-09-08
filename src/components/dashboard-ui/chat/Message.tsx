




interface Props {
    message?: any;
}



const Message = (props: Props) => {

    return <div className="flex justify-start">

        <div className="bg-slate-800 text-white p-3 rounded-lg text-sm">
            This is a message
        </div>

    </div>
}


export default Message;