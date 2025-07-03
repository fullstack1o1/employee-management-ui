import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Api, type JobTitleRequest, type JobTitleResponse } from "../myApi";
import { APIStatus, type IApiResponse } from "./department.slice";

interface IState {
  jobTitles: IApiResponse<JobTitleResponse[]>;
  createJob: IApiResponse<JobTitleResponse>;
  deleteJob: IApiResponse<void>;
  updateJob: IApiResponse<JobTitleResponse>;
}

const api = new Api({
  baseUrl:
    "https://employee-app.whitewater-d0b6f62a.westeurope.azurecontainerapps.io/api",
});

const initialState: IState = {
  jobTitles: { data: [], status: APIStatus.IDLE },
  createJob: { data: {} as JobTitleResponse, status: APIStatus.IDLE },
  deleteJob: { data: undefined, status: APIStatus.IDLE },
  updateJob: { data: {} as JobTitleResponse, status: APIStatus.IDLE },
};
// fetch all job title list
export const fetchJobTitles = createAsyncThunk("job/fetchJobs", async () => {
  const res = await api.jobtitle.jobtitleList();
  console.log(res.data);
  return res.data;
});
// // create a new job title
export const createJobTitle = createAsyncThunk(
  "job/createJobTitle",
  async ({ data }: { data: JobTitleRequest }) => {
    const res = await api.jobtitle.jobtitleCreate(data);
    console.log(res.data);
    return res.data;
  }
);
// delete jobTitle by its ID
export const deleteJobTitle = createAsyncThunk(
  "job/deleteJobTitle",
  async ({ id }: { id: number }) => {
    const res = await api.jobtitle.jobtitleDelete(id);
    return res.data;
  }
);

//update jobTitle by its Id
export const updateJobTitle = createAsyncThunk(
  "job/updateJobTitle",
  async ({ id, data }: { id: number; data: JobTitleResponse }) => {
    const res = await api.jobtitle.jobtitleUpdate(id, data);
    console.log("updated data", res.data);
    return res.data;
  }
);

export const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      //fetch departmentlist
      .addCase(fetchJobTitles.pending, (state) => {
        state.jobTitles.status = APIStatus.PENDING;
      })
      .addCase(fetchJobTitles.rejected, (state) => {
        state.jobTitles.status = APIStatus.FAILED;
        state.jobTitles.error = "Some Error Occured";
      })
      .addCase(fetchJobTitles.fulfilled, (state, action) => {
        state.jobTitles.status = APIStatus.FULLFILLED;
        state.jobTitles.data = action.payload;
      })
      //create job title
      .addCase(createJobTitle.pending, (state) => {
        state.createJob.status = APIStatus.PENDING;
      })
      .addCase(createJobTitle.rejected, (state) => {
        state.createJob.status = APIStatus.FAILED;
        state.createJob.error = "Some Error Occured";
      })
      .addCase(createJobTitle.fulfilled, (state, action) => {
        state.createJob.status = APIStatus.FULLFILLED;
        state.createJob.data = action.payload;
        state.jobTitles.data.push(action.payload);
      })
      //delete job title
      .addCase(deleteJobTitle.pending, (state) => {
        state.deleteJob.status = APIStatus.PENDING;
      })
      .addCase(deleteJobTitle.rejected, (state) => {
        state.deleteJob.status = APIStatus.FAILED;
        state.deleteJob.error = "Some Error Occured";
      })
      .addCase(deleteJobTitle.fulfilled, (state, action) => {
        state.deleteJob.status = APIStatus.FULLFILLED;
        state.deleteJob.data = action.payload;
        state.jobTitles.data = state.jobTitles.data.filter(
          (job) => job.jobId !== action.meta.arg.id
        );
      })
      //update job title
      .addCase(updateJobTitle.pending, (state) => {
        state.updateJob.status = APIStatus.PENDING;
      })
      .addCase(updateJobTitle.rejected, (state) => {
        state.updateJob.status = APIStatus.FAILED;
        state.updateJob.error = "Some Error Occured";
      })
      .addCase(updateJobTitle.fulfilled, (state, action) => {
        state.updateJob.status = APIStatus.FULLFILLED;
        state.updateJob.data = action.payload;
        state.jobTitles.data = state.jobTitles.data.map((jobTitle) =>
          jobTitle.jobId === action.payload.jobId ? action.payload : jobTitle
        );
      });
  },
});

jobSlice.actions = {
  fetchJobTitles,
  createJobTitle,
  deleteJobTitle,
  updateJobTitle,
};

export default jobSlice.reducer;
