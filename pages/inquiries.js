import {
    Card, Grid, Group, Text,
    Title
  } from "@mantine/core";
  import moment from "moment";
  import { getSession, useSession } from "next-auth/react";
  import Link from "next/link";
  import { useState } from "react";
  import useSWR from "swr";
  import Layout from "../components/Layout";
  import AddRecordButton from "../components/table/addRecordButton";
  import DeleteRecordButton from "../components/table/deleteRecordButton";
  import EditRecordButton from "../components/table/editRecordButton";
  import { TableInquiries } from "../components/TableInquiries";
  
  const columns = [
    {
      name: <th> Purpose </th>,
      cell: (row) => row.purpose,
    },
    {
      name: <th> Report </th>,
      cell: (row) => row.report,
    },
    {
      name: <th> Type </th>,
      cell: (row) => row.type,
    },
    {
      name: <th> Inquired Date </th>,
      cell: (row) => moment(row.dateInquired).format('MMMM Do YYYY, h:mm:ss a'),
    },
    {
      name: <th> Status </th>,
      cell: (row) => row.status,
    },
    {
      name: <th> Action </th>,
      cell: (row) => <EditRecordButton id={row._id}>Edit</EditRecordButton>,
    },
  ];
  
  const Inquiries = () => {
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const [inquiry, setInquiry] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
  
    const { data: session } = useSession();
    const { data, error } = useSWR("/api/inquiries/getInquiries", fetcher, {
      refreshInterval: 500,
    });
    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;
  
    return (
      <Layout>
        {!session && (
          <>
            <Grid>
              <Grid.Col>
                <Text>
                  You are not signed in. Sign in{" "}
                  <Link href="/auth/login">here</Link>
                </Text>
              </Grid.Col>
            </Grid>
          </>
        )}
        {session && data && (
          <>
            <Grid mt={12}>
              <Grid.Col span={12}>
                <Card>
                  <Title mb={6} >Inquiries</Title>
                 
                  <Group> 
                  <AddRecordButton />
                  <DeleteRecordButton
                    selectedRows={selectedRows}
                    data={data}
                    setData={setInquiry}
                    setSelectedRows={setSelectedRows}
                    toggleCleared={toggleCleared}
                    setToggleCleared={setToggleCleared}
                  />
                  </Group>
                  
                  <TableInquiries
                    data={data}
                    setData={setInquiry}
                    columns={columns}
                    setSelectedRows={setSelectedRows}
                    toggleCleared={toggleCleared}
                    setToggleCleared={setToggleCleared}
                  />
                </Card>
              </Grid.Col>
            </Grid>
          </>
        )}
      </Layout>
    );
  };
  
  export default Inquiries;
  
  export async function getServerSideProps(context) {
    const session = await getSession(context);
    if (!session) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }
    return {
      props: {
        session,
      },
    };
  }
  