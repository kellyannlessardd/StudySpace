

import express from "express";
import cors from "cors";
import { readFile, writeFile } from "node:fs/promises";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = new URL("./data/assignments.json", import.meta.url);

// Read the JSON file
async function getData() {
  const content = await readFile(DATA_FILE, "utf-8");
  return JSON.parse(content);
}

// Save changes to the JSON file
async function saveData(data) {
  await writeFile(
    DATA_FILE,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

// Validate assignment information
function validateAssignment(body) {
  const { title, courseId, dueDate, priority, status } = body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    !Number.isInteger(courseId) ||
    typeof dueDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) ||
    Number.isNaN(Date.parse(dueDate)) ||
    new Date(`${dueDate}T00:00:00.000Z`).toISOString().slice(0, 10) !== dueDate ||
    !["Low", "Medium", "High"].includes(priority) ||
    !["Not Started", "In Progress", "Completed"].includes(status)
  ) {
    return "Please provide a valid title, course, date, priority, and status.";
  }

  return null;
}

// Test route
app.get("/api", (req, res) => {
  res.json({ message: "StudySpace API is running!" });
});

// Get, filter, and sort assignments
app.get("/api/assignments", async (req, res) => {
  try {
    const data = await getData();
    let assignments = data.assignments;

    const { courseId, priority, status, search, sortBy, order } = req.query;

    if (courseId) {
      assignments = assignments.filter(
        (a) => a.courseId === Number(courseId)
      );
    }

    if (priority) {
      assignments = assignments.filter(
        (a) => a.priority === priority
      );
    }

    if (status) {
      assignments = assignments.filter(
        (a) => a.status === status
      );
    }

    if (search) {
      assignments = assignments.filter(
        (a) => a.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "dueDate") {
      assignments.sort((a, b) => {
        const comparison = a.dueDate.localeCompare(b.dueDate);
        return order === "desc" ? -comparison : comparison;
      });
    }

    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load assignments." });
  }
});

// Get one assignment
app.get("/api/assignments/:id", async (req, res) => {
  try {
    const data = await getData();
    const assignment = data.assignments.find(
      (a) => a.id === Number(req.params.id)
    );

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found." });
    }

    res.json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load assignment." });
  }
});

// Create an assignment
app.post("/api/assignments", async (req, res) => {
  try {
    const data = await getData();
    const error = validateAssignment(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    const courseExists = data.courses.some(
      (course) => course.id === req.body.courseId
    );

    if (!courseExists) {
      return res.status(400).json({ error: "Course does not exist." });
    }

    const assignment = {
      id: Math.max(0, ...data.assignments.map((a) => a.id)) + 1,
      title: req.body.title.trim(),
      description: req.body.description || "",
      courseId: req.body.courseId,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      status: req.body.status
    };

    data.assignments.push(assignment);
    await saveData(data);

    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create assignment." });
  }
});

// Update an assignment
app.patch("/api/assignments/:id", async (req, res) => {
  try {
    const data = await getData();
    const index = data.assignments.findIndex(
      (a) => a.id === Number(req.params.id)
    );

    if (index === -1) {
      return res.status(404).json({ error: "Assignment not found." });
    }

    const updated = {
      ...data.assignments[index],
      ...req.body,
      id: data.assignments[index].id
    };

    const error = validateAssignment(updated);

    if (error) {
      return res.status(400).json({ error });
    }

    const courseExists = data.courses.some(
      (course) => course.id === updated.courseId
    );

    if (!courseExists) {
      return res.status(400).json({ error: "Course does not exist." });
    }

    updated.title = updated.title.trim();
    data.assignments[index] = updated;

    await saveData(data);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update assignment." });
  }
});

// Delete an assignment
app.delete("/api/assignments/:id", async (req, res) => {
  try {
    const data = await getData();
    const index = data.assignments.findIndex(
      (a) => a.id === Number(req.params.id)
    );

    if (index === -1) {
      return res.status(404).json({ error: "Assignment not found." });
    }

    const deleted = data.assignments.splice(index, 1)[0];
    await saveData(data);

    res.json({ message: "Assignment deleted.", assignment: deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete assignment." });
  }
});

// Get all courses
app.get("/api/courses", async (req, res) => {
  try {
    const data = await getData();
    res.json(data.courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load courses." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`StudySpace API running at http://localhost:${PORT}`);
});


