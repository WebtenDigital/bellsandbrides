type StepBackProps={
    handleClick?: ()=>void
    type?: "preconfigured"
}

export default function StepBackButton(props:StepBackProps){
    return(
        <main>
            {
                props.type?
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>
                :
                <button type="button" className="p-3 border border-gray-900 rounded-full rotate-180"
                    onClick={props.handleClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>
            }

        </main>
    );
}