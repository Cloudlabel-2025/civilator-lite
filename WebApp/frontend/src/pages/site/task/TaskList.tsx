import React, { useState, useEffect } from "react";
import { useParams, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Layout } from "../../../components/Layout/Layout";
import { Button } from "../../../components/Common/Button";
import { Modal } from "../../../components/Common/Modal";
import { FormField } from "../../../components/Common/FormField";
import { Table } from "../../../components/Common/Table";
import { Plus, Edit, Trash2 } from "lucide-react";
import TasksHandler from "../../../handler/tasks";
import Utils from "../../../helpers/utils";
import { UnitOptions } from "../../../data/constants";
import { ViewTask } from "./ViewTask";
import { UpdateTaskProgress } from "./UpdateTaskProgress";

interface Task {
  id: string;
  site_id: string;
  name: string;
  description?: string;
  category?: string;
  priority?: string;
  start_date?: string;
  end_date?: string;

  unit?: string;
  total_work_progress?: number;
  sno?: number;
}

export const TaskList: React.FC = () => {
  const { siteId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const tasksHandler = new TasksHandler();
  const navigator = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    priority: "medium",
    start_date: "",
    end_date: "",
    unit: "%",
    total_work_progress: "",
  });

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        name: task.name,
        description: task.description || "",
        category: task.category || "",
        priority: task.priority || "medium",
        start_date: task.start_date || "",
        end_date: task.end_date || "",

        unit: task.unit || "",
        total_work_progress: task.total_work_progress?.toString() || "",
      });
    } else {
      setEditingTask(null);
      setFormData({
        name: "",
        description: "",
        category: "",
        priority: "medium",
        start_date: "",
        end_date: "",

        unit: "%",
        total_work_progress: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      site_id: siteId,
      name: formData.name,
      description: formData.description,
      start_date: formData.start_date,
      end_date: formData.end_date,
      unit: formData.unit || "%",
      total_work_progress: formData.total_work_progress
        ? Number(formData.total_work_progress)
        : 100,
    };

    try {
      let response: any = { success: false };

      if (editingTask) {
        response = await tasksHandler.put({ id: editingTask.id, ...payload });
      } else {
        response = await tasksHandler.post(payload);
      }

      if (!response.success) {
        alert(response.message || "Error saving task");
        return;
      }

      loadTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await tasksHandler.delete({ id: taskId });
        loadTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const loadTasks = async () => {
    try {
      const response = await tasksHandler.get({ site_id: siteId });
      if (response.success) {
        const items = response.data.items || [];
        const tasks = items.map((task: Task, idx: number) => {
          let duration_days = task.end_date
            ? Utils.getDuration(
                new Date().getTime(),
                new Date(task.end_date || 0).getTime() || 0,
                "days"
              )
            : 0;
          let status_value = getStatus(task);
          let status_label = getStatusEenem(status_value, duration_days);

          return {
            ...task,
            status_value,
            status_label,
            delay: task.end_date
              ? Utils.getDuration(
                  new Date().getTime() || 0,
                  new Date(task.end_date).getTime() || 0,
                  "days"
                ) || 0
              : 0,
            duration:
              task.start_date && task.end_date
                ? Utils.getDuration(
                    new Date(task.start_date).getTime() || 0,
                    new Date(task.end_date).getTime() || 0,
                    "days"
                  ) || 0
                : 0,
            sno: idx + 1,
          };
        });
        setTasks(tasks);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const renderParamsAction = () => {
    const params = new URLSearchParams(window.location.search);
    let action = params.get("action");

    if (action == "add") {
      setIsModalOpen(true);
    }
  };
  useEffect(() => {
    loadTasks();
    renderParamsAction();
  }, []);

  const getStatusBadge = (task: any) => {
    return (
      <span
        className={`task-tabel-status task-tabel-status-${task.status_value}`}
      >
        {task.status_label}
      </span>
    );
  };

  const getStatus = (item: any | {}) => {
    if (!item.start_date || !item.end_date) return "0"; // No dates added
    else if (
      new Date().getTime() < new Date(item.start_date).getTime() &&
      new Date().getTime() < new Date(item.end_date).getTime()
    )
      return "1"; // Upcoming task
    else if (
      new Date().getTime() > new Date(item.start_date).getTime() &&
      new Date().getTime() < new Date(item.end_date).getTime() &&
      item.work_done_progress == "0"
    )
      return "2"; // Not started
    else if (
      new Date().getTime() > new Date(item.start_date).getTime() &&
      new Date().getTime() < new Date(item.end_date).getTime() &&
      item.work_done_progress != "0" &&
      item.work_done_progress < item.total_work_progress
    )
      return "3"; // In Progress
    else if (item.work_done_progress == item.total_work_progress)
      return "4"; // Completed
    else if (
      new Date().getTime() > new Date(item.end_date).getTime() &&
      item.work_done_progress != item.total_work_progress
    )
      return "5"; // Delayed by days
    else if (item.status == "3") return "6"; // on Hold
    else if (item.status == "4") return "7"; // Stopped

    return "-";
  };
  const getStatusEenem = (type: string | number, delay: number) => {
    if (type == "0") return "No dates added";
    else if (type == "1") return "Upcoming task";
    else if (type == "2") return "Not started";
    else if (type == "3") return "In Progress";
    else if (type == "4") return "Completed";
    else if (type == "5") return `Delayed by ${delay}`;
    else if (type == "6") return "on Hold";
    else if (type == "7") return "Stopped";
    else return "-";
  };

  const columns = [
    {
      key: "sno",
      header: "S.No",
      mobileLabel: "S.No",
      showInMobile: false,
    },
    {
      key: "name",
      header: "Task Name",
      mobileLabel: "Name",
      showInMobile: false,
      render: (value: string, row: Task) => (
        <Link
          to={`/site/${siteId}/tasks/${row.id}`}
          className="text-blue-600 underline"
        >
          {value}
        </Link>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      mobileLabel: "Duration",
      showInMobile: false,
      render: (value: string) => (value ? String(value) + " days" : "-"),
    },
    {
      key: "start_date",
      header: "Start Date",
      mobileLabel: "Start",
      showInMobile: true,
      render: (value: string) => value || "-",
    },
    {
      key: "end_date",
      header: "End Date",
      mobileLabel: "End",
      showInMobile: true,
      render: (value: string) => value || "-",
    },
    {
      key: "status",
      header: "Status",
      mobileLabel: "Status",
      showInMobile: true,
      render: (value: string, row: Task) => getStatusBadge(row),
    },

    {
      key: "assignee_name",
      header: "Assigned To",
      mobileLabel: "Assigned To",
      showInMobile: false,
      render: (value: string, row: any) => {
        return (
          row.assignees?.map((assignee: any) => assignee.name).join(", ") ||
          "Unassigned"
        );
      },
    },
    {
      key: "total_work_progress",
      header: "Quantity",
      mobileLabel: "Qty",
      showInMobile: false,
      render: (value: number, row: Task) =>
        value ? `${value} ${row.unit || ""}` : "-",
    },
  ];

  return (
    <Layout title="Tasks">
      <Routes>
        <Route path="/:taskId" element={<ViewTask />} />
        <Route
          path="/:taskId/update-progress"
          element={<UpdateTaskProgress />}
        />
      </Routes>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? "Edit Task" : "Create New Task"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField
            label="Task Name"
            value={formData.name}
            onChange={(value) =>
              setFormData({ ...formData, name: value as string })
            }
            required
          />

          <FormField
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(value) =>
              setFormData({ ...formData, description: value as string })
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(value) =>
                setFormData({ ...formData, start_date: value as string })
              }
            />
            <FormField
              label="End Date"
              type="date"
              value={formData.end_date}
              onChange={(value) =>
                setFormData({ ...formData, end_date: value as string })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Unit"
              value={formData.unit}
              type="select"
              options={UnitOptions}
              onChange={(value) =>
                setFormData({ ...formData, unit: value as string })
              }
              className="w-full"
            />
            <FormField
              label="Estimated Quantity"
              type="number"
              value={formData.total_work_progress}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  total_work_progress: value as string,
                })
              }
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </Modal>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          <Button
            onClick={() => handleOpenModal()}
            icon={Plus}
            iconPosition="left"
          >
            Add New
          </Button>
        </div>

        <Table
          columns={columns}
          data={tasks}
          mobileCardTitle={(task) => (
            <Link
              to={`/site/${siteId}/tasks/${task.id}`}
              className="text-blue-600"
            >
              {task.name}
            </Link>
          )}
          mobileCardSubtitle={(task) =>
            `${task.duration ? String(task.duration) + " days" : ""} • ${
              task.assignees
                ?.map((assignee: any) => assignee.name)
                .join(", ") || "Unassigned"
            }`
          }
          actions={(task) => (
            <>
              <Button
                size="sm"
                variant="primary_light"
                onClick={() =>
                  navigator(`/site/${siteId}/tasks/${task.id}/update-progress`)
                }
              >
                Update
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(task.id)}
                icon={Trash2}
                className="text-red-600 hover:text-red-700"
              />
            </>
          )}
        />
      </div>
    </Layout>
  );
};
