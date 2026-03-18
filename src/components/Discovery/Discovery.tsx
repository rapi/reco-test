import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import classes from "./Discovery.module.css";
import { Grid } from "@mui/system";
const HOST = "https://recotest.pythonanywhere.com";
type AppType = {
  appId: string;
  appName: string;
  appSources: string[];
  category: string;
};
type FilerType = {
  pageNumber: number;
  pageSize: number;
  appName?: string;
  category?: string;
};
type ResponseType = { appRows: AppType[]; totalCount: number };
export const Discovery = () => {
  const [filer, setFilter] = useState<FilerType>({
    pageNumber: 0,
    pageSize: 25,
  });
  const [appList, setAppList] = useState<AppType[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchData = useCallback(() => {
    setIsLoading(true);
    axios
      .put(`${HOST}/api/v1/app-service/get-apps`, filer)
      .then((response: AxiosResponse<ResponseType>) => {
        setAppList(response.data.appRows);
        setPageCount(response.data.totalCount);
        setError("");
      })
      .catch((error: AxiosError<{ error: string }>) => {
        setError(error.response?.data.error ?? error.message);
      })
      .then(() => {
        setIsLoading(false);
      });
  }, [filer]);

  useEffect(() => {
    fetchData();
  }, [fetchData, filer]);
  const toggleFilter = useCallback((filter: Partial<FilerType>) => {
    setFilter((oldFilter) => ({
      ...oldFilter,
      ...filter,
    }));
  }, []);
  if (isLoading) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className={classes.discovery}>
      {error && (
        <div className={classes.alert}>
          <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
            {error} <Button onClick={() => fetchData()}>Try Again</Button>
          </Alert>
        </div>
      )}
      <Grid container spacing={0}>
        <Grid size={8}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Connection</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appList.map((row) => (
                  <TableRow key={row.appId}>
                    <TableCell>{row.appName}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>
                      {row.appSources.map((source) => (
                        <Chip key={source} label={source} />
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={pageCount}
            page={filer.pageNumber}
            onPageChange={(e, pageNumber) => toggleFilter({ pageNumber })}
            rowsPerPage={filer.pageSize}
            rowsPerPageOptions={[25, 50]}
            onRowsPerPageChange={(event) =>
              toggleFilter({ pageSize: parseInt(event.target.value, 10) })
            }
          />
        </Grid>
        <Grid size={4}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Filter</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <TextField
                      size="small"
                      id="outlined-basic"
                      label="Name Filter"
                      variant="outlined"
                      onChange={(input) =>
                        toggleFilter({
                          appName: input.target.value,
                          pageNumber: 0,
                        })
                      }
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <TextField
                      size="small"
                      id="outlined-basic"
                      label="Category Filter"
                      variant="outlined"
                      onChange={(input) =>
                        toggleFilter({
                          category: input.target.value,
                          pageNumber: 0,
                        })
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};
