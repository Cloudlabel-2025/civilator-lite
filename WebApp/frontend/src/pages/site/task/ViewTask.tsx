import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/Common/Button";
import { Trash2, Plus, Workflow, Send, X } from "lucide-react";
import { SideDrawer } from "../../../components/Common/SideDrawer";
import { FormField } from "../../../components/Common/FormField";
import TasksHandler from "../../../handler/tasks";
import SitesHandler from "../../../handler/sites";
import Utils from "../../../helpers/utils";
import { UnitOptions } from "../../../data/constants";
import PreviewFiles from "../../../components/Common/PreviewFiles";

export const ViewTask: React.FC = () => {
  const { siteId, taskId } = useParams();
  const navigator = useNavigate();
  const tasksHandler = new TasksHandler();
  const sitesHandler = new SitesHandler();

  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
  const [Duration, setDuration] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [Unit, setUnit] = useState("");
  const [TotalWorkDone, setTotalWorkDone] = useState(0);
  const [TotalWork, setTotalWork] = useState(0);
  const [TotalWorkDonePercentage, setTotalWorkDonePercentage] = useState(0);
  const [SelectedAssignees, setSelectedAssignees] = useState([]);
  const [Photos, setPhotos] = useState<any[]>([]);
  const [TimelineLogs, setTimelineLogs] = useState([]);
  const [StatusEnem, setStatusEnem] = useState("-1");
  const [StatusLabel, setStatusLabel] = useState("");
  const [DetilsInputsChanged, setDetilsInputsChanged] = useState(false);

  const [ActiveSection, setActiveSection] = useState("task-section-detials");

  const [CommentsItems, setCommentsItems] = useState([]);
  const [CommentsInput, setCommentsInput] = useState("");

  const [PreviewImage, setPreviewImage] = useState(null);

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

  const ToggleSectionItems = [
    {
      id: "task-section-detials",
      label: "Detials",
    },
    {
      id: "task-section-timeline",
      label: "Timeline",
    },
    {
      id: "task-section-photos",
      label: "Photos",
    },
    {
      id: "task-section-comments",
      label: "Comments",
    },
  ];

  const [Employees, setEmployees] = useState<any>([]);
  const AssigneesOptions = Employees.map((item: any) => ({
    value: item.id,
    label: item.name,
  }));

  const HandleSaveDetails = async () => {
    try {
      let payload = {
        site_id: siteId,
        id: taskId,
        name: Name,
        description: Description,
        start_date: StartDate,
        end_date: EndDate,
        unit: Unit,
        total_work_progress: TotalWork,
        assignees: SelectedAssignees,
      };

      const response = await tasksHandler.put(payload);
      if (response.success) {
        setDetilsInputsChanged(false);
        navigator(-1);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const HandleToggleItemClick = (item: any) => {
    setActiveSection(item.id);

    let section_detials = document.getElementById(item.id);
    if (!section_detials) return;
    section_detials.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  const loadTask = async () => {
    try {
      const response = await tasksHandler.get({ site_id: siteId, id: taskId });
      if (response.success) {
        const data = response.data.items[0] || {};
        if (!data) {
          navigator(-1);
        }

        setName(data.name || "");
        setDescription(data.description || "");

        setStartDate(data.start_date || "");
        setEndDate(data.end_date || "");
        setUnit(data.unit || "");
        setTotalWorkDone(data.work_done_progress || 0);
        setTotalWork(data.total_work_progress || 0);
        setSelectedAssignees(data.assignees || []);
        setTimelineLogs(data.progress_timeline || []);
        setCommentsItems(data.comments || []);

        let duration = data.end_date
          ? Utils.getDuration(
              new Date(data.start_date).getTime(),
              new Date(data.end_date).getTime(),
              "days"
            )
          : 0;

        setDuration(duration);
        let work_done_percentage =
          data.work_done_progress && data.total_work_progress
            ? (data.work_done_progress / data.total_work_progress) * 100
            : 0;

        setTotalWorkDonePercentage(work_done_percentage);

        let duration_days = Utils.getDuration(
          new Date().getTime(),
          new Date(data.end_date).getTime() || 0,
          "days"
        );

        setStatusEnem(getStatus(data));
        setStatusLabel(
          getStatusEenem(getStatus(data), `${duration_days} days`)
        );

        let progress_timeline = data.progress_timeline || [];
        let photos: any[] = [];

        progress_timeline.forEach((item: any) => {
          if (!item.attachments || item.attachments.length == 0) return;

          item.attachments.forEach((attendance: any) => {
            photos.push({ ...attendance, time: item.time });
          });
        });

        setPhotos(photos);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };
  const loadSites = async () => {
    try {
      const response = await sitesHandler.get({
        id: siteId,
      });

      if (!response.success) {
        return;
      }

      let sites = response.data.items || [];

      if (!sites.length) {
        return;
      }

      let data = sites[0] || {};
      let employees = data.team || [];
      setEmployees(employees);
    } catch (error) {
      console.error("Error loading sites:", error);
    }
  };

  const HandleDetialsInput = (value: string, type: string) => {
    setDetilsInputsChanged(true);
    if (type == "name") {
      setName(value);
    } else if (type == "description") {
      setDescription(value);
    } else if (type == "unit") {
      setUnit(value);
    } else if (type == "start_date") {
      setStartDate(value);

      if (value && EndDate) {
        let duration_days = Utils.getDuration(
          new Date(EndDate).getTime(),
          new Date(value).getTime(),
          "days"
        );
        setDuration(duration_days);
      }
    } else if (type == "end_date") {
      setEndDate(value);

      if (StartDate && value) {
        let duration_days = Utils.getDuration(
          new Date(value).getTime(),
          new Date(StartDate).getTime(),
          "days"
        );
        setDuration(duration_days);
      }
    } else if (type == "duration") {
      value = Utils.numberOnly(value);
      setDuration(value);
      if (!value) return;
      if (StartDate) {
        let end_date = Utils.getDateFromStartAndDaysDuration(
          StartDate,
          parseInt(value),
          "+"
        );

        if (!end_date) return;

        end_date = Utils.getLocalFullDate_reverse(end_date);

        setEndDate(end_date);
      } else if (EndDate) {
        let start_date = Utils.getDateFromStartAndDaysDuration(
          EndDate,
          parseInt(value),
          "-"
        );
        if (!start_date) return;

        start_date = Utils.getLocalFullDate_reverse(start_date);

        setStartDate(start_date);
      }
    } else if (type == "total_work") {
      setTotalWork(parseInt(value));
    } else if (type == "assignee") {
      let assignee = Employees.filter((opt: any) => opt.id == value)[0];
      if (!assignee) return;

      let _SelectedAssignees: any[] = [...SelectedAssignees];
      let assignee_index = _SelectedAssignees.findIndex(
        (item) => item.id == assignee.id
      );

      if (assignee_index == -1) {
        _SelectedAssignees.push({
          id: assignee.id,
          name: assignee.name,
          role_id: assignee.role_id || "",
          role_name: assignee.role_name || "",
        });
      }

      setSelectedAssignees(_SelectedAssignees);
    }
  };

  const HandleRemoveAssignee = (id: any) => {
    let _SelectedAssignees = [...SelectedAssignees];
    let assignee_index = _SelectedAssignees.findIndex((item) => item.id == id);
    if (assignee_index == -1) return;
    _SelectedAssignees.splice(assignee_index, 1);
    setSelectedAssignees(_SelectedAssignees);
  };

  const HandleRemoveProgress = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this progress?"))
      return;

    let timelineLogs = [...TimelineLogs];

    let progress_index = timelineLogs.findIndex((item: any) => item.id == id);
    if (progress_index == -1) return;
    timelineLogs.splice(progress_index, 1);
    setTimelineLogs(timelineLogs);

    let payload = {
      task_id: taskId,
      id: id,
    };

    let response = await tasksHandler.deleteTaskProgress(payload);

    if (!response.success) {
      return;
    }
  };

  const HandleAddComtent = async (message: string) => {
    if (!message) return;

    setCommentsInput("");

    let payload = {
      task_id: taskId,
      message: message,
    };

    let response = await tasksHandler.createTaskComment(payload);

    if (!response.success) {
      return;
    }

    loadTask();
    setActiveSection("task-section-comments");
  };

  const HandleRemoveComment = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this comment?"))
      return;

    let commentsItems = [...CommentsItems];

    let idx = commentsItems.findIndex((item: any) => item.id == id);
    if (idx == -1) return;
    commentsItems.splice(idx, 1);
    setCommentsItems(commentsItems);

    let payload = {
      task_id: taskId,
      id: id,
    };

    let response = await tasksHandler.deleteTaskComment(payload);

    if (!response.success) {
      return;
    }
  };

  useEffect(() => {
    loadTask();
    loadSites();
  }, []);

  const TitleChildres = (
    <>
      <div className="flex flex-col gap-1">
        <div className="text-md font-semibold text-gray-900">{Name}</div>
        <div className="flex items-center gap-2">
          <span className={`task-tabel-status task-tabel-status-${StatusEnem}`}>
            {StatusLabel}
          </span>
          <span>
            {TotalWork ? TotalWorkDone + " " + Unit + " " : ""}(
            {Math.round(TotalWorkDonePercentage)}%)
          </span>
        </div>
      </div>
    </>
  );

  const renderDetails = () => {
    return (
      <div
        className="w-full h-[max-content] min-h-[100vh] flex flex-col gap-4"
        id="task-section-detials"
      >
        <h3 className="text-lg font-semibold text-gray-900">Details</h3>
        <div className="flex flex-col gap-4">
          <FormField
            label="NAME"
            value={Name}
            onChange={(value) => HandleDetialsInput(value, "name")}
            required
          />
          <FormField
            label="DESCRIPTION"
            value={Description}
            onChange={(value) => HandleDetialsInput(value, "description")}
          />
          <FormField
            label="DURATION (DAYS)"
            value={Duration}
            onChange={(value) => HandleDetialsInput(value, "duration")}
            className="w-full"
          />

          <div className="flex gap-3">
            <FormField
              label="START DATE"
              value={StartDate}
              type="date"
              onChange={(value) => HandleDetialsInput(value, "start_date")}
              className="w-full"
            />
            <FormField
              label="END DATE"
              value={EndDate}
              type="date"
              onChange={(value) => HandleDetialsInput(value, "end_date")}
              className="w-full"
            />
          </div>

          <div className="flex gap-3">
            <FormField
              label="Est Quantity"
              value={TotalWork}
              type="number"
              onChange={(value) => HandleDetialsInput(value, "total_work")}
              className="w-full"
            />
            <FormField
              label="UNIT"
              value={Unit}
              type="select"
              options={UnitOptions}
              onChange={(value) => HandleDetialsInput(value, "unit")}
              className="w-full"
            />
          </div>
          <FormField
            label="ASSIGNED TO"
            value={""}
            type="select"
            options={AssigneesOptions}
            onChange={(value) => HandleDetialsInput(value, "assignee")}
          />
          <div className="flex flex-col gap-2">
            {SelectedAssignees.map((assignee: any, idx: number) => (
              <div
                key={assignee.id}
                className="flex items-center justify-between border border-gray-200 rounded-md p-2"
              >
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold text-gray-900">
                    {assignee.name}
                  </div>
                  <div className="text-sm text-gray-700">
                    {assignee.role_name}
                  </div>
                </div>
                <div className="h-[max-content] flex items-center justify-end">
                  <Trash2
                    className="w-4 h-4 cursor-pointer text-red-500"
                    onClick={() => HandleRemoveAssignee(assignee.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTimeline = () => {
    return (
      <div
        className="w-full h-[max-content] min-h-[100vh] flex flex-col gap-4"
        id="task-section-timeline"
      >
        <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
        <div className="w-full flex flex-col gap-4">
          {TimelineLogs.sort((a, b) => b.time - a.time)?.map(
            (log: any, idx: number) => (
              <div
                key={`timeline-log-${idx}`}
                className="w-full flex gap-4 relative border-b border-gray-200 pb-4"
              >
                {log.type == "created" ? (
                  <>
                    <div className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-blue-500 mt-2">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-full flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-md font-semibold text-gray-900">
                          Task Created
                        </div>
                        <div className="text-xs text-gray-500">
                          On {new Date(log.time).toLocaleString()} by{" "}
                          {log.added_by}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-yellow-500 mt-2">
                      {log.type == "progress" ? (
                        <Workflow className="w-4 h-4 text-white" />
                      ) : (
                        <X className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="w-full flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-md font-semibold text-gray-900">
                          {log.type == "progress"
                            ? `Progress Update - ${
                                log.progress_value
                              } ${Unit} (${Math.round(
                                (log.progress_value / TotalWork) * 100
                              ).toFixed(0)}%)`
                            : "No Progress"}
                        </div>
                        <div className="text-xs text-gray-500">
                          On {new Date(log.time).toLocaleString()} by{" "}
                          {log.added_by}
                        </div>
                      </div>
                      <div className="w-full flex gap-3 flex-wrap">
                        <div className="w-[30%] h-[max-content] flex flex-col">
                          <span className="text-sm text-gray-400">
                            Work Done
                          </span>
                          <span className="text-md text-gray-900">
                            {log.progress_value}/100 %
                          </span>
                        </div>
                        {log?.attendances?.length > 0 && (
                          <div className="w-[30%] h-[max-content] flex flex-col">
                            <span className="text-sm text-gray-400">
                              Total Workers
                            </span>
                            <span className="text-md text-gray-900">
                              {log?.attendances?.reduce(
                                (acc: number, cur: any) => acc + cur.count,
                                0
                              )}
                            </span>
                          </div>
                        )}
                        {log?.attendances?.map(
                          (attendance: any, idx: number) => (
                            <div
                              className="w-[30%] h-[max-content] flex flex-col"
                              key={idx}
                            >
                              <span className="text-sm text-gray-400">
                                {attendance.labour_name}
                              </span>
                              <span className="text-md text-gray-900">
                                {attendance.count}
                              </span>
                            </div>
                          )
                        )}
                        {log?.materials?.map((material: any, idx: number) => (
                          <div
                            className="w-[30%] h-[max-content] flex flex-col"
                            key={idx}
                          >
                            <span className="text-sm text-gray-400">
                              {material.material_name}
                            </span>
                            <span className="text-md text-gray-900">
                              {material.quantity} {material.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="w-full flex gap-3 flex-wrap">
                        {log?.attachments?.map(
                          (attachment: any, idx: number) => (
                            <img
                              src={attachment.url}
                              className="w-[70px] h-[50px] border border-gray-200 object-cover rounded-md cursor-pointer"
                              key={`timeline-attachment-${idx}`}
                              onClick={() => setPreviewImage(attachment.url)}
                            />
                          )
                        )}
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Trash2
                        className="w-4 h-4 cursor-pointer text-red-500"
                        onClick={() => HandleRemoveProgress(log.id)}
                      />
                    </div>
                  </>
                )}
              </div>
            )
          )}
        </div>
      </div>
    );
  };
  const renderPhotos = () => {
    return (
      <div
        className="w-full h-[max-content] min-h-[100vh] flex flex-col gap-4"
        id="task-section-photos"
      >
        <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
        <div className="w-full flex flex-wrap gap-4">
          {Photos?.map((photo: any, idx: number) => (
            <img
              src={photo.url}
              className="w-[100px] h-[100px] border border-gray-200 object-cover rounded-md cursor-pointer"
              key={`timeline-photo-${idx}`}
              onClick={() => setPreviewImage(photo.url)}
            />
          ))}
        </div>
      </div>
    );
  };
  const renderComments = () => {
    return (
      <div
        className="w-full h-[max-content] min-h-[100vh] flex flex-col gap-4"
        id="task-section-comments"
      >
        <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
        <div className="w-full h-full flex flex-col gap-4">
          <div className="w-full h-[calc(100%-150px)] flex flex-col gap-4 overflow-y-auto overflow-x-hidden">
            {CommentsItems?.map((item: any, idx: number) => (
              <div
                className="w-full h-[max-content] flex gap-3 relative border-b border-gray-200 pb-4"
                key={idx}
              >
                <div className="mt-2 w-[30px] h-[30px] flex items-center justify-center rounded-full bg-blue-500 text-white">
                  {item.user_name?.charAt(0)}
                </div>
                <div className="w-full flex flex-col">
                  <span className="text-md text-gray-900">
                    {item.user_name}
                  </span>
                  <span className="text-sm text-gray-400">
                    {Utils.getLocalFullDateLabel(item.created_at)}
                  </span>
                  <span className="max-w-[calc(100%-30px)] text-sm text-gray-900 mt-2">
                    {item.message}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <Trash2
                    className="w-4 h-4 cursor-pointer text-red-500"
                    onClick={() => HandleRemoveComment(item.id)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="w-full h-[150px] flex gap-4">
            <div className="mt-2 w-[30px] h-[30px] flex items-center justify-center rounded-full bg-blue-500 text-white">
              R
            </div>
            <div className="w-full h-[max-content] max-h-full flex flex-col gap-2 border border-blue-700 p-2">
              <textarea
                name="comment"
                id=""
                className="w-full min-h[50px] max-h-[150px] resize-none border-none outline-none"
                placeholder="Add a Comment"
                value={CommentsInput}
                onChange={(e) => setCommentsInput(e.target.value)}
              ></textarea>
              <div
                className={`w-[34px] h-[34px] flex rounded-full items-center justify-center ${
                  CommentsInput.length
                    ? "bg-blue-500 cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                onClick={() => HandleAddComtent(CommentsInput)}
              >
                <Send className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <SideDrawer
        isOpen={true}
        onClose={() => {
          if (DetilsInputsChanged) {
            if (
              window.confirm(
                "You have unsaved changes. Do you want to discard them?"
              )
            ) {
              navigator(-1);
            }
          } else {
            navigator(-1);
          }
        }}
        title_children={TitleChildres}
        size="lg"
      >
        <div className="w-full h-full flex flex-col gap-2">
          <div className="width-full p-2 flex items-center gap-[10px] overflow-x-auto overflow-y-hidden scrollbar-width: none;">
            {ToggleSectionItems.map((item) => (
              <div
                key={item.id}
                className={`w-[max-content] h-[30px] flex items-center justify-center rounded-md px-[10px] text-center whitespace-nowrap cursor-pointer text-sm ${
                  ActiveSection == item.id
                    ? "border border-blue-700 bg-blue-50 text-blue-700"
                    : "border border-transparent bg-transparent text-gray-700"
                }`}
                onClick={() => HandleToggleItemClick(item)}
              >
                {item.label}
              </div>
            ))}
          </div>

          <div className="w-full p-4 h-[calc(100%-90px)] block overflow-y-auto overflow-x-hidden">
            {renderDetails()}
            {renderTimeline()}
            {renderPhotos()}
            {renderComments()}
          </div>

          <div
            className={`w-full h-[50px] border-t border-gray-200 flex gap-4 items-center justify-end p-4`}
          >
            {DetilsInputsChanged && (
              <Button
                size="sm"
                type="button"
                variant="primary"
                onClick={() => HandleSaveDetails()}
              >
                Save Changes
              </Button>
            )}
            <Button
              size="sm"
              type="button"
              icon={Plus}
              variant="warning"
              onClick={() =>
                navigator(`/site/${siteId}/tasks/${taskId}/update-progress`)
              }
            >
              UPDATE TASK LOG
            </Button>
          </div>
        </div>
      </SideDrawer>

      {PreviewImage && (
        <PreviewFiles
          isPreviewModalOpen={PreviewImage != null}
          files={[PreviewImage]}
          setIsPreviewModalOpen={() => setPreviewImage(null)}
        />
      )}
    </>
  );
};
