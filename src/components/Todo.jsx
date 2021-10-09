import { useFormik } from "formik";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import * as yup from "yup";
import { collection, addDoc, getDocs, deleteField  } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const userCol = collection(db, "todo");

const validationSchema = yup.object({
  title: yup.string("Enter your email").required("Email is required"),
});

async function del(id) {
  await userCol.doc(id).delete();
  // await deleteField (ref(db, `/realTimeTodo/${id}`));
}

function Todo() {
  const [todo, settodo] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(userCol);
      let todo = [];
      // console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        todo.push(doc.data());
      });
      settodo(todo);
    };
    getData();

    return () => {
      console.log("cleanup");
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    onSubmit: async (values) => {
      try {
        const docRef = await addDoc(userCol, {
          title: values.title,
          description: values.description,
        });
        console.log("Document written with ID: ", docRef.id);
        alert("Todo Added");
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    validationSchema: validationSchema,
  });

  return (
    <Box sx={{ flexGrow: 1, m: 2 }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Todo
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

export default Todo;
