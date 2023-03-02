import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import React, { FC, useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { LoaderContext } from "../../App";
import BacktoMenuButton from "../../components/BacktoMenuButton";
import StickyHeadTable from "../../components/custom/Table";
import { userServices } from "../../utils/api/user/services";

export interface Column {
  id:
    | "byUser"
    | "action"
    | "createdOn"
    | "deviceInfo"
    | "userId"
    | "ipAddress"
    | string;
  label: string;
  minWidth?: number;
  colorCoded?: boolean;
  align?: "right" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "ipAddress", label: "Ip Address", minWidth: 100 },
  { id: "byUser", label: "Action By", align: "center", minWidth: 50 },
  {
    id: "userId",
    label: "User",
    minWidth: 20,
    align: "center",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 20,
    align: "center",
  },
  {
    id: "deviceInfo",
    label: "Device Info",
    minWidth: 20,
    align: "center",
  },
  {
    id: "createdOn",
    label: "Created Data",
    minWidth: 20,
    align: "center",
  },
];

interface Data {
  ipAddress: string;
  byUser: string;
  userId: string;
  deviceInfo: string;
  action: string;
  createdOn: string;
}

// function createData(
//     ipAddress: string,
//   lastLogin: string,
//   userid: string,
//   deviceInfo: string,
// ): Data {

//   return { ipAddress, lastLogin, userid, deviceInfo};
// }

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px",
};
const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  marginRight: " 8px",
  width: "100%",
  maxWidth: "200px",
};
export const ChnagePasswordHistory: FC<any> = () => {
  //    let data:LoginHistoryResponse[]=logindata.logindata;

  const [changePasswordData, setChangePasswordData] = React.useState([]);
  const { loading, setLoading } = useContext(LoaderContext);
  const date = new Date();
  const futureDate = date.getDate() - 60;
  date.setDate(futureDate);
  const defaultValue = moment().subtract(7, "days").format("YYYY-MM-DD");
  const current = new Date();
  const currentValue = moment().format("YYYY-MM-DD");
  const lableStyle = { alignSelf: "center" };
  const [formData, setFormData] = React.useState({
    fromDate: defaultValue,
    toDate: currentValue,
    type: "login",
    pageSize: 25,
    userId: "",
  });

  const getNewEvent = async () => {
    // if (changePasswordData.length) return;
    setLoading &&
      setLoading((prev) => ({ ...prev, getNewEventChangePassword: true }));
    const { response } = await userServices.getChangePasswordHistory(formData);
    setLoading &&
      setLoading((prev) => ({ ...prev, getNewEventChangePassword: false }));
    if (response?.data) {
      if (response?.data?.length > 0) {
        setChangePasswordData(response.data);
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    getNewEvent();
  }, [formData]);
  function handleChange(event: { target: { name: any; value: any } }) {
    setFormData((preState) => {
      return {
        ...preState,
        [event.target.name]: event.target.value,
      };
    });
  }
  return (
    <Box sx={{ m: "auto", maxWidth: "lg" }}>
      {changePasswordData.length > 0 ? (
        <>
          <form style={style}>
            <Grid container>
              <Grid item xs={6} md={3} style={style}>
                <label style={lableStyle} htmlFor="fromDate">
                  From Date
                </label>
                <input
                  style={inputStyle}
                  type="date"
                  defaultValue={formData.fromDate}
                  placeholder="YYYY-MM-DD"
                  onChange={handleChange}
                  name="fromDate"
                />
              </Grid>
              <Grid item xs={6} md={3} style={style}>
                {" "}
                <label style={lableStyle} htmlFor="toDate">
                  To Date
                </label>
                <input
                  style={inputStyle}
                  type="date"
                  defaultValue={formData.toDate}
                  placeholder="YYYY-MM-DD"
                  onChange={handleChange}
                  name="toDate"
                />
              </Grid>
              {/* <Grid item xs={6} md={3} style={style}>
                {" "}
                <label style={lableStyle} htmlFor="type">
                  Type
                </label>
                <select style={inputStyle} onChange={getNewEvent} name="type">
                  <option selected value="1">
                    ALL
                  </option>
                  <option value="2">Deposit/Withdarw Report</option>
                  <option value="3">Game Report</option>
                </select>
              </Grid> */}
              {/* <button type="button" onClick={getNewEvent} style={{}}>
                Search
              </button> */}

              <Grid item xs={6} md={3} style={style}>
                <Button
                  // fullWidth
                  type="button"
                  variant="contained"
                  onClick={getNewEvent}
                >
                  search
                </Button>
              </Grid>
              {/* <label style={lableStyle} htmlFor="noOfRecords">No Of Rows</label>
        <select style={inputStyle} onChange={handleChange} name="noOfRecords">
          <option selected value="1">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        */}
            </Grid>
          </form>
          <StickyHeadTable
            rows={changePasswordData}
            columns={columns}
            title={"Change Password History"}
          />
        </>
      ) : (
        <Typography mt="15vh" variant="h4" color="error">
          {"No Data Found"}
        </Typography>
      )}
    </Box>
  );
};
