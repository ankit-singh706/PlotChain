import {LogInWithAnonAadhaar,useAnonAadhaar,AnonAadhaarProof} from "@anon-aadhaar/react";
import { useEffect } from "react";
import { useProver } from "@anon-aadhaar/react";
  
  export default function Home() {
    const [anonAadhaar] = useAnonAadhaar();
    const [, latestProof] = useProver();
  
    useEffect(() => {
      console.log("Anon Aadhaar status: ", anonAadhaar.status);
    }, [anonAadhaar]);

    console.log(AnonAadhaarProof,latestProof)
  
    return (
        <>
      <div>
        <LogInWithAnonAadhaar nullifierSeed={1234} />
        {/* <p>{anonAadhaar?.status}</p> */}
      </div>
      <div >
        
        {/* Render the proof if generated and valid */}
        {/* {anonAadhaar?.status === "logged-in" && (
          <>
            <p>✅ Proof is valid</p>
            {latestProof && (
                <AnonAadhaarProof code={JSON.stringify(latestProof, null, 2)} />
              )}
          </>
          )} */}
      </div>
        </>
    );
  }