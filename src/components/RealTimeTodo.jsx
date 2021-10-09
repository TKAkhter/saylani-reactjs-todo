import { useFormik } from "formik";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import * as yup from "yup";
import { useEffect, useState } from "react";
import firebase from "firebase";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";

const db = getDatabase();

const validationSchema = yup.object({
  title: yup.string("Enter your email").required("Email is required"),
});

async function del(id) {
  await remove(ref(db, `/realTimeTodo/${id}`));
}

function RealtimeTodo() {
  const [todo, settodo] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "realTimeTodo/");
    let temp = [];
    const unsubscribe = onValue(starCountRef, (snapshot) => {
      const data = snapshot;
      // console.log(data);
      data.forEach((doc) => {
        let id = doc.key;
        let data = doc.val();

        temp.unshift({
          id: id,
          title: data.title,
          description: data.description,
        });
      });
      settodo(temp);
      temp = [];
    });

    return () => {
      unsubscribe();
      console.log("unsub");
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    onSubmit: async (values) => {
      try {
        function writeUserData(title, description) {
          push(ref(db, "realTimeTodo/"), {
            title: values.title,
            description: values.description,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
          });
        }
        writeUserData();
        console.log("Document written with ID: ");
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    validationSchema: validationSchema,
  });

  return (
    <Box sx={{ flexGrow: 1, m: 2 }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Realtime Todo
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Paper style={{ margin: 16, padding: 16 }} elevation={3}>
          <Grid container alignItems="center" spacing={2}>
            <Grid xs={5} md={10} item style={{ paddingRight: 16 }}>
              <TextField
                fullWidth
                placeholder="Add Todo here"
                color="primary"
                id="outlined-basic"
                label="Task"
                variant="filled"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid xs={5} md={10} item style={{ paddingRight: 16 }}>
              <TextField
                fullWidth
                color="primary"
                id="outlined-basic"
                label="Description"
                variant="filled"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </Grid>
            <Grid xs={2} md={2} item>
              <Button
                fullWidth
                color="success"
                variant="contained"
                type="submit"
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
      <Paper style={{ margin: 16, padding: 16 }} elevation={3}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Recently Added:
        </Typography>
        <List spacing={3}>
          {todo.map((eachTodo) => {
            return (
              <Paper style={{ margin: 10 }} elevation={3}>
                <ListItem
                  key={eachTodo.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon
                        onClick={() => {
                          del(eachTodo.id);
                        }}
                      />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={eachTodo.title}
                    secondary={eachTodo.description}
                  />
                </ListItem>
              </Paper>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}

export default RealtimeTodo;
