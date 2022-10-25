import Sentence from "./dashboard/Sentence";

type DateMathematicsProps={
    thedate: Date
}

// props: the date in milliseconds

export default function DateMathematics(props: DateMathematicsProps){
    
    const onehour=60*60*1000;
    const oneday=24*60*60*1000;
    const oneweek=7*24*60*60*1000;
    const onemonth=30*24*60*60*1000;
    const oneyear=365*24*60*60*1000;
    
    // const thedifferenceindays=thedifferenceinms/oneday;
    // const thedifferenceinweeks=thedifferenceinms/oneweek;
    // const thedifferenceinmonths=thedifferenceinms/onemonth;
    // const thedifferenceinyears=thedifferenceinms/oneyear;

    function dateStatement(thedifferenceinms: number){
        if(thedifferenceinms/onehour<1){
            return `a few seconds`
        }
        else if(thedifferenceinms/onehour<24&&thedifferenceinms/onehour>1){
            return `${Math.floor(thedifferenceinms/onehour)} ${Math.floor(thedifferenceinms/onehour)===1?"hour":"hours"}`
        }
        else if(thedifferenceinms/onehour>=24&&thedifferenceinms/oneday<7){
            return `${Math.floor(thedifferenceinms/oneday)} ${Math.floor(thedifferenceinms/oneday)===1?"day":"days"}`
        }
        else if(thedifferenceinms/oneday>=7&&thedifferenceinms/oneweek<4){
            return `${Math.floor(thedifferenceinms/oneweek)} ${Math.floor(thedifferenceinms/oneweek)===1?"week":"weeks"}`
        }  
        else if(thedifferenceinms/oneweek>4&&thedifferenceinms/onemonth<=12){
            return `${Math.floor(thedifferenceinms/onemonth)} ${Math.floor(thedifferenceinms/onemonth)===1?"month":"months"}`
        } 
        else if(thedifferenceinms/onemonth>12){
            return `${Math.floor(thedifferenceinms/oneyear)} ${Math.floor(thedifferenceinms/oneyear)===1?"year":"years"}`
        }
    }

    // console.log(dateStatement(Date.now() - Date.parse(new Date().toString())));
    // console.log(new Date().toString());

    return (
    <main>
        <Sentence text={`${dateStatement(Date.now() - Date.parse(props.thedate.toString()))}`}/>
    </main>
  );
}
