import React, { useState, type ChangeEvent, type FormEvent } from 'react'
import useJobs from '../hooks/useJobs';
import ReferralModal from './ReferralModal';
import type { Job } from './types';
import ShareJobModal from './ShareJobModal';

type Props = {}
type ActiveModal = {
    type : 'refer' |'share'|null,
    jobId : number |null,
}

const Jobs = (props: Props) => {

      const {data , isLoading , isError , error} = useJobs();
      const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

      const [ActiveModal , setActiveModal] = useState<ActiveModal>({
        type : null , 
        jobId : null,
      });

        if (isLoading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
      const closeModal = () =>{
        setActiveModal({
            type:null , jobId:null
        })
      }
  return (
    <>
        <div className='font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>Job Position</div>
         
       <div className="p-4">
             <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.map((job) => (
                
                <li key={job.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold text-slate-900">Title : {job.title}</h2>
                    <p className="text-sm text-sky-700 font-medium">Role : {job.role}</p>
                   <p className="text-sm text-sky-700 font-medium">JD : {job.description}</p>
                   <p className="text-sm text-sky-700 font-medium">Exp: {job.expYearsReq}</p>
                    <h2>Contact Mail : {job.contactMail}</h2>
                    <h2>No of Positions : {job.totalPositions}</h2>
                    <h2>Job Url : {job.jdUrl}</h2>
                    <h2>Status : {job.status}</h2>
                    <div>
                        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mr-5 mt-2"
                        onClick={()=>setActiveModal({type : 'refer' , jobId:job.id})}
                        >Refer Friend</button>

                             {ActiveModal.type==='refer' && ActiveModal.jobId &&(
                                <ReferralModal
                                jobId={ActiveModal.jobId}
                                jobTitle={data?.find((j: Job) => j.id === ActiveModal.jobId)?.title || ''}
                                isOpen={true}
                                onClose={() => closeModal()}
                                />
                            )}
                            
                            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                            onClick={()=>setActiveModal({type : 'share' , jobId:job.id})}

                            >Share Job</button>
                            {ActiveModal.type==='share' && ActiveModal.jobId && (
                                    <ShareJobModal
                                    jobId={ActiveModal.jobId}
                                    jobTitle={data?.find((j: Job) => j.id === ActiveModal.jobId)?.title || ''}
                                    isOpen={true}
                                    onClose={() => closeModal()}
                                    />
                        )}
                    </div>
                </li>
                ))}
            </ul>
         </div>
    </>
  )
}

export default Jobs;