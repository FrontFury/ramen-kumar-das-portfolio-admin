import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Briefcase,
  Loader2,
  PlusCircle,
  Link2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

const AddExperience = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      designation: "",
      organization: "",
      institutionDetails: "",
      topicsOrAddress: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      websiteLink: "",
    },
  });

  const [loading, setLoading] = useState(false);

  // Watched Values
  const selectedStartDate = watch("startDate");
  const selectedEndDate = watch("endDate");
  const isCurrentlyWorking = watch("currentlyWorking");

  // --- Start Datepicker States & Logic ---
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [startCurrentMonth, setStartCurrentMonth] = useState(new Date());
  const startDatePickerRef = useRef(null);

  // --- End Datepicker States & Logic ---
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [endCurrentMonth, setEndCurrentMonth] = useState(new Date());
  const endDatePickerRef = useRef(null);

  // Close DatePickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        startDatePickerRef.current &&
        !startDatePickerRef.current.contains(event.target)
      ) {
        setShowStartDatePicker(false);
      }
      if (
        endDatePickerRef.current &&
        !endDatePickerRef.current.contains(event.target)
      ) {
        setShowEndDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear previous notifications on mount
  useEffect(() => {
    toast.dismiss();
  }, []);

  // Date Selection Handlers
  const handleStartDateSelect = (day) => {
    const year = startCurrentMonth.getFullYear();
    const month = String(startCurrentMonth.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const selectedDate = `${year}-${month}-${formattedDay}`;

    setValue("startDate", selectedDate, { shouldValidate: true });
    setShowStartDatePicker(false);
  };

  const handleEndDateSelect = (day) => {
    const year = endCurrentMonth.getFullYear();
    const month = String(endCurrentMonth.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const selectedDate = `${year}-${month}-${formattedDay}`;

    setValue("endDate", selectedDate, { shouldValidate: true });
    setShowEndDatePicker(false);
  };

  // Calendar Helpers for Start Date
  const startDaysInMonth = new Date(
    startCurrentMonth.getFullYear(),
    startCurrentMonth.getMonth() + 1,
    0
  ).getDate();
  const startFirstDay = new Date(
    startCurrentMonth.getFullYear(),
    startCurrentMonth.getMonth(),
    1
  ).getDay();

  // Calendar Helpers for End Date
  const endDaysInMonth = new Date(
    endCurrentMonth.getFullYear(),
    endCurrentMonth.getMonth() + 1,
    0
  ).getDate();
  const endFirstDay = new Date(
    endCurrentMonth.getFullYear(),
    endCurrentMonth.getMonth(),
    1
  ).getDay();

  // Submit Handler
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Date formatting to match your display style (e.g. "11 July 2023")
      const formattedStartDate = data.startDate
        ? new Date(data.startDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "";

      const formattedEndDate = data.currentlyWorking
        ? "till"
        : data.endDate
        ? new Date(data.endDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "till";

      const newExperience = {
        designation: data.designation,
        organization: data.organization,
        institutionDetails: data.institutionDetails || "",
        topicsOrAddress: data.topicsOrAddress || "",
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        currentlyWorking: data.currentlyWorking,
        websiteLink: data.websiteLink || "",
        createdAt: new Date().toISOString(),
      };

      const backendRes = await fetch("http://localhost:3000/experiences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExperience),
      });

      if (!backendRes.ok) {
        throw new Error("Failed to save experience details.");
      }

      toast.success("Experience added successfully! 🎉");

      reset();

      setTimeout(() => {
        navigate("/experience/all");
      }, 2000);
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans p-4 sm:p-6 lg:pr-24">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl shadow-md">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                Add New Experience
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Add your teaching, mentoring, or professional work experiences.
              </p>
            </div>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Designation / Role Title */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Designation / Role Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lecturer(3+ years) or Mentor"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${
                    errors.designation
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-gray-200 focus:border-emerald-600"
                  } rounded-xl text-sm focus:outline-none focus:bg-white transition-all`}
                  {...register("designation", {
                    required: "Designation is required",
                  })}
                />
                {errors.designation && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">
                    {errors.designation.message}
                  </p>
                )}
              </div>

              {/* Organization / Department Name */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Organization / Department Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Department of Computer Science & Engineering"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${
                    errors.organization
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-gray-200 focus:border-emerald-600"
                  } rounded-xl text-sm focus:outline-none focus:bg-white transition-all`}
                  {...register("organization", {
                    required: "Organization is required",
                  })}
                />
                {errors.organization && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">
                    {errors.organization.message}
                  </p>
                )}
              </div>

              {/* Institution / University Details */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Institution / University Details (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Daffodil Institute of Information Technology (Under National University)"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 rounded-xl text-sm focus:outline-none focus:bg-white transition-all"
                  {...register("institutionDetails")}
                />
              </div>

              {/* START DATE (CUSTOM DATEPICKER) */}
              <div className="relative" ref={startDatePickerRef}>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Start Date / From <span className="text-rose-500">*</span>
                </label>

                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: "Start Date is required" }}
                  render={({ field }) => (
                    <div>
                      <div
                        onClick={() => setShowStartDatePicker((prev) => !prev)}
                        className={`w-full px-4 py-2.5 bg-gray-50 border ${
                          errors.startDate ? "border-rose-500" : "border-gray-200"
                        } rounded-xl text-sm flex items-center justify-between cursor-pointer hover:bg-emerald-50/40 hover:border-emerald-300 transition-all group`}
                      >
                        <span
                          className={
                            field.value
                              ? "text-gray-800 font-semibold"
                              : "text-gray-400"
                          }
                        >
                          {field.value
                            ? new Date(field.value).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Select start date..."}
                        </span>
                        <CalendarIcon className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                      </div>
                      {errors.startDate && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* START DATE POPUP */}
                {showStartDatePicker && (
                  <div className="absolute top-full left-0 mt-2 z-50 w-80 bg-white border border-emerald-100 rounded-2xl shadow-2xl p-4 transition-all animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                      <button
                        type="button"
                        onClick={() =>
                          setStartCurrentMonth(
                            new Date(
                              startCurrentMonth.getFullYear(),
                              startCurrentMonth.getMonth() - 1,
                              1
                            )
                          )
                        }
                        className="p-1.5 hover:bg-emerald-50 text-emerald-800 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-[#163A2D] text-sm font-['Playfair_Display',serif]">
                        {startCurrentMonth.toLocaleString("default", {
                          month: "long",
                        })}{" "}
                        {startCurrentMonth.getFullYear()}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setStartCurrentMonth(
                            new Date(
                              startCurrentMonth.getFullYear(),
                              startCurrentMonth.getMonth() + 1,
                              1
                            )
                          )
                        }
                        className="p-1.5 hover:bg-emerald-50 text-emerald-800 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 text-center text-[11px] font-bold text-emerald-800/70 mb-2">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {Array.from({ length: startFirstDay }).map((_, index) => (
                        <div key={`empty-start-${index}`} />
                      ))}

                      {Array.from({ length: startDaysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateString = `${startCurrentMonth.getFullYear()}-${String(
                          startCurrentMonth.getMonth() + 1
                        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const isSelected = selectedStartDate === dateString;

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleStartDateSelect(day)}
                            className={`py-2 rounded-xl font-medium transition-all ${
                              isSelected
                                ? "bg-[#163A2D] text-amber-300 font-bold shadow-md scale-105"
                                : "hover:bg-emerald-50 text-gray-700 hover:text-emerald-800"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* END DATE (CUSTOM DATEPICKER) */}
              <div className="relative" ref={endDatePickerRef}>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  End Date / To
                </label>

                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div
                        onClick={() => {
                          if (!isCurrentlyWorking)
                            setShowEndDatePicker((prev) => !prev);
                        }}
                        className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm flex items-center justify-between ${
                          isCurrentlyWorking
                            ? "opacity-50 bg-gray-100 cursor-not-allowed"
                            : "cursor-pointer hover:bg-emerald-50/40 hover:border-emerald-300"
                        } transition-all group`}
                      >
                        <span
                          className={
                            field.value && !isCurrentlyWorking
                              ? "text-gray-800 font-semibold"
                              : "text-gray-400"
                          }
                        >
                          {isCurrentlyWorking
                            ? "Present (till)"
                            : field.value
                            ? new Date(field.value).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Select end date..."}
                        </span>
                        <CalendarIcon className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  )}
                />

                {/* END DATE POPUP */}
                {showEndDatePicker && !isCurrentlyWorking && (
                  <div className="absolute top-full left-0 mt-2 z-50 w-80 bg-white border border-emerald-100 rounded-2xl shadow-2xl p-4 transition-all animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                      <button
                        type="button"
                        onClick={() =>
                          setEndCurrentMonth(
                            new Date(
                              endCurrentMonth.getFullYear(),
                              endCurrentMonth.getMonth() - 1,
                              1
                            )
                          )
                        }
                        className="p-1.5 hover:bg-emerald-50 text-emerald-800 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-[#163A2D] text-sm font-['Playfair_Display',serif]">
                        {endCurrentMonth.toLocaleString("default", {
                          month: "long",
                        })}{" "}
                        {endCurrentMonth.getFullYear()}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setEndCurrentMonth(
                            new Date(
                              endCurrentMonth.getFullYear(),
                              endCurrentMonth.getMonth() + 1,
                              1
                            )
                          )
                        }
                        className="p-1.5 hover:bg-emerald-50 text-emerald-800 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 text-center text-[11px] font-bold text-emerald-800/70 mb-2">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {Array.from({ length: endFirstDay }).map((_, index) => (
                        <div key={`empty-end-${index}`} />
                      ))}

                      {Array.from({ length: endDaysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateString = `${endCurrentMonth.getFullYear()}-${String(
                          endCurrentMonth.getMonth() + 1
                        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const isSelected = selectedEndDate === dateString;

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleEndDateSelect(day)}
                            className={`py-2 rounded-xl font-medium transition-all ${
                              isSelected
                                ? "bg-[#163A2D] text-amber-300 font-bold shadow-md scale-105"
                                : "hover:bg-emerald-50 text-gray-700 hover:text-emerald-800"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Currently Working Checkbox */}
              <div className="md:col-span-2 flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="currentlyWorking"
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                  {...register("currentlyWorking")}
                />
                <label
                  htmlFor="currentlyWorking"
                  className="text-xs font-semibold text-gray-700 cursor-pointer"
                >
                  Currently working here (Will set End Date to 'till')
                </label>
              </div>

              {/* Website / Portfolio Link */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Website / Portfolio URL (Optional)
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    placeholder="https://example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 rounded-xl text-sm focus:outline-none focus:bg-white transition-all"
                    {...register("websiteLink")}
                  />
                </div>
              </div>
            </div>

            {/* Address or Topics Taught */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                Address or Topics Taught (Optional)
              </label>
              <textarea
                rows="3"
                placeholder="e.g. Address: Daffodil Plaza... OR Topics: Open cv, neural network, Image Processing, NLP"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-emerald-600 rounded-xl text-sm focus:outline-none focus:bg-white transition-all resize-none"
                {...register("topicsOrAddress")}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 font-semibold text-sm rounded-xl transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Experience...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish Experience</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExperience;