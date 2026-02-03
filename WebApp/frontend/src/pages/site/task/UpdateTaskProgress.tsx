import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/Common/Button";
import { Trash2, Plus } from "lucide-react";
import { SideDrawer } from "../../../components/Common/SideDrawer";
import { FormField } from "../../../components/Common/FormField";
import FileUpload from "../../../components/Common/UploadFiles";

import { ToggleTabs } from "../../../components/Common/ToggleTabs";
import { SliderInput } from "../../../components/Common/SliderInput";
import TasksHandler from "../../../handler/tasks";
import Utils from "../../../helpers/utils";
import PreviewFiles from "../../../components/Common/PreviewFiles";
import MaterialsMasterHandler from "../../../handler/master_materials";
import LaboursMasterHandler from "../../../handler/master_labours";

export const UpdateTaskProgress: React.FC = () => {
  const { siteId, taskId } = useParams();
  const navigator = useNavigate();
  const tasksHandler = new TasksHandler();
  const materialsMasterHandler = new MaterialsMasterHandler();
  const laboursMasterHandler = new LaboursMasterHandler();

  const [MasterMaterials, setMasterMaterials] = useState<any[]>([]);
  const [MasterLabours, setMasterLabours] = useState<any[]>([]);

  const MaterialsOptions = MasterMaterials.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const LaboursOptions = MasterLabours.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const [Name, setName] = useState("");
  const [Unit, setUnit] = useState("");
  const [TotalWorkDone, setTotalWorkDone] = useState(0);
  const [TotalWork, setTotalWork] = useState(0);

  const [TotalWorkDoneChanged, setTotalWorkDoneChanged] =
    useState(TotalWorkDone);

  const [Attachments, setAttachments] = useState([]);
  const [Remarks, setRemarks] = useState("");

  const [Materialsused, setMaterialsused] = useState<any[]>([]);
  const [Attendance, setAttendance] = useState<any[]>([]);

  const [StatusEnem, setStatusEnem] = useState("-1");
  const [StatusLabel, setStatusLabel] = useState("");

  const [ActiveSection, setActiveSection] = useState("progress");

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
      label: "Update progress",
      id: "progress",
    },
    {
      label: "No Progress today",
      id: "no_progress",
    },
  ];

  const loadTask = async () => {
    try {
      const response = await tasksHandler.get({ site_id: siteId, id: taskId });
      if (response.success) {
        const data = response.data.items[0] || {};
        if (!data) {
          navigator(-1);
        }

        setName(data.name || "");

        setUnit(data.unit || "");
        setTotalWorkDone(data.work_done_progress || 100);
        setTotalWork(data.total_work_progress || 0);

        let duration_days = Utils.getDuration(
          new Date().getTime(),
          new Date(data.end_date).getTime() || 0,
          "days"
        );

        setStatusEnem(getStatus(data));
        setStatusLabel(
          getStatusEenem(getStatus(data), `${duration_days} days`)
        );
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };
  const loadMasterMaterials = async () => {
    try {
      const response = await materialsMasterHandler.get({});
      if (response.success) {
        setMasterMaterials(response.data.items || []);
      }
    } catch (error) {
      console.error("Error loading materials:", error);
    }
  };
  const loadMasterLabours = async () => {
    try {
      const response = await laboursMasterHandler.get({});
      if (response.success) {
        setMasterLabours(response.data.items || []);
      }
    } catch (error) {
      console.error("Error loading labours:", error);
    }
  };

  const HandleAddMaterial = (e: any) => {
    setMaterialsused([
      ...Materialsused,
      { material_id: "", material_name: "", quantity: 0 },
    ]);
  };
  const HandleAddAttendance = (e: any) => {
    setAttendance([
      ...Attendance,
      { labour_id: "", labour_name: "", count: 0 },
    ]);
  };

  const HandleSave = async (e: any) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("task_id", String(taskId));
      formDataToSend.append("type", ActiveSection);
      formDataToSend.append("progress_value", String(TotalWorkDoneChanged));
      formDataToSend.append("remarks", Remarks);
      formDataToSend.append("materials", JSON.stringify(Materialsused || "[]"));
      formDataToSend.append("attendances", JSON.stringify(Attendance));

      Attachments.forEach((file) => {
        formDataToSend.append("attachments", file);
      });

      let response: any = await tasksHandler.updateTaskProgress(formDataToSend);

      if (!response.success) {
        alert(response.message || "Error updating task");
        return;
      }

      navigator(-1);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  useEffect(() => {
    loadTask();
    loadMasterMaterials();
    loadMasterLabours();
  }, []);

  const TitleChildres = (
    <>
      <div className="flex flex-col gap-1">
        <div className="text-md font-semibold text-gray-900">
          Update progress - {Name}
        </div>
        <div className="flex items-center gap-2">
          <span className={`task-tabel-status task-tabel-status-${StatusEnem}`}>
            {StatusLabel}
          </span>
          <span>
            {TotalWorkDone ? TotalWorkDone + " " + Unit + " " : ""}(
            {TotalWork
              ? parseFloat(
                  String((Math.round(TotalWorkDone) / TotalWork) * 100)
                ).toFixed(2)
              : "0"}
            %)
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      <SideDrawer
        isOpen={true}
        onClose={() => navigator(-1)}
        title_children={TitleChildres}
        size="md"
      >
        <div className="w-full h-full flex flex-col select-none">
          <div className="w-full p-2 h-[calc(100%-50px)] block overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-4">
              <ToggleTabs
                activeTab={ActiveSection}
                tabs={ToggleSectionItems}
                onTabChange={(tab) => setActiveSection(tab.id)}
              />

              {ActiveSection == "progress" &&
                (String(Unit).includes("%") ? (
                  <SliderInput
                    id="progress"
                    label="Work done today"
                    value={TotalWorkDoneChanged}
                    max={TotalWork}
                    min={0}
                    unit={Unit}
                    setValue={setTotalWorkDoneChanged}
                  />
                ) : (
                  <FormField
                    label={`Work done today`}
                    value_label={Unit}
                    type="number"
                    value={TotalWorkDoneChanged}
                    max={TotalWork}
                    max_label={`${
                      TotalWorkDoneChanged || TotalWorkDone
                    }/${TotalWork} ${Unit} finished`}
                    min={0}
                    onChange={(value) => {
                      if (value > TotalWork) setTotalWorkDoneChanged(TotalWork);
                      else setTotalWorkDoneChanged(value);
                    }}
                    className="w-full"
                  />
                ))}

              <FileUpload
                label="Add Photos (Optional)"
                type="multiple"
                files={Attachments}
                has_geodata={true}
                setFiles={(files: any) => setAttachments(files)}
              />

              <FormField
                label="Remarks"
                type="textarea"
                value={Remarks}
                onChange={(value) => setRemarks(value as string)}
              />

              {ActiveSection == "progress" ? (
                <>
                  {Materialsused.length ? (
                    <div className="flex flex-col gap-3 border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-md font-semibold">
                          Materials Used
                        </span>
                        <div
                          className="flex items-center text-sm text-blue-700 cursor-pointer"
                          onClick={HandleAddMaterial}
                        >
                          <Plus className="w-4 h-4 text-blue-700" />
                          Add
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        {Materialsused.map((item, index) => (
                          <div key={index} className="flex gap-2 items-end">
                            <FormField
                              label={`Material ${index + 1}`}
                              type="select"
                              options={MaterialsOptions}
                              value={item.material_id}
                              onChange={(value) => {
                                let material = MasterMaterials.find(
                                  (material) => material.id === value
                                );
                                const newMaterialsused = [...Materialsused];
                                newMaterialsused[index].material_id =
                                  material?.id || "";
                                newMaterialsused[index].unit =
                                  material?.unit || "";
                                newMaterialsused[index].material_name =
                                  material?.name || "";
                                setMaterialsused(newMaterialsused);
                              }}
                              className="w-[60%]"
                            />
                            <FormField
                              label={`Quantity ${
                                item.unit ? `(${item.unit})` : ""
                              }`}
                              type="number"
                              value={item.quantity}
                              onChange={(value) => {
                                const newMaterialsused = [...Materialsused];
                                newMaterialsused[index].quantity = value;
                                setMaterialsused(newMaterialsused);
                              }}
                              className="w-[30%]"
                            />

                            <Trash2
                              className="w-5 h-5 text-red-700 cursor-pointer mb-2"
                              onClick={() => {
                                const newMaterialsused = [...Materialsused];
                                newMaterialsused.splice(index, 1);
                                setMaterialsused(newMaterialsused);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={HandleAddMaterial}
                    >
                      <Plus className="w-6 h-6 text-blue-700" />
                      <span className="text-sm text-blue-700">
                        Add Material Used
                      </span>
                    </div>
                  )}

                  {Attendance.length ? (
                    <div className="flex flex-col gap-3 border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-md font-semibold">
                          Attendance
                        </span>
                        <div
                          className="flex items-center text-sm text-blue-700 cursor-pointer"
                          onClick={HandleAddAttendance}
                        >
                          <Plus className="w-4 h-4 text-blue-700" />
                          Add
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        {Attendance.map((item, index) => (
                          <div key={index} className="flex gap-2 items-end">
                            <FormField
                              label={`Labour ${index + 1}`}
                              type="select"
                              options={LaboursOptions}
                              value={item.labour_id}
                              onChange={(value) => {
                                let labour = MasterLabours.find(
                                  (labour) => labour.id === value
                                );
                                const newAttendance = [...Attendance];
                                newAttendance[index].labour_id =
                                  labour?.id || "";
                                newAttendance[index].labour_name =
                                  labour?.name || "";
                                setAttendance(newAttendance);
                              }}
                              className="w-[60%]"
                            />
                            <FormField
                              label={`Count`}
                              type="number"
                              value={item.count}
                              onChange={(value) => {
                                const newAttendance = [...Attendance];
                                newAttendance[index].count = value;
                                setAttendance(newAttendance);
                              }}
                              className="w-[30%]"
                            />

                            <Trash2
                              className="w-5 h-5 text-red-700 cursor-pointer mb-2"
                              onClick={() => {
                                const newAttendance = [...Attendance];
                                newAttendance.splice(index, 1);
                                setAttendance(newAttendance);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={HandleAddAttendance}
                    >
                      <Plus className="w-6 h-6 text-blue-700" />
                      <span className="text-sm text-blue-700">
                        Add Attendance
                      </span>
                    </div>
                  )}
                </>
              ) : (
                ""
              )}
            </div>
          </div>

          <div
            className={`w-full h-[50px] border-t border-gray-200 flex gap-4 items-center p-4`}
          >
            <Button
              size="md"
              type="button"
              variant="primary"
              onClick={HandleSave}
              className="w-full"
            >
              SAVE
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
