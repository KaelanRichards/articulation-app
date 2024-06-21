import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const SpeakingTab = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [dailyTopic, setDailyTopic] = useState("");

  const dailyTopics = [
    "The importance of clear communication",
    "How technology affects language",
    "The role of body language in communication",
    "The impact of social media on language",
    "The benefits of learning multiple languages",
  ];

  useEffect(() => {
    refreshDailyTopic();
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
    if (!isRecording) {
      setRecordingTime(0);
    }
  };

  const refreshDailyTopic = () => {
    setDailyTopic(dailyTopics[Math.floor(Math.random() * dailyTopics.length)]);
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <span>Daily Speaking Practice</span>
        <Button onClick={refreshDailyTopic} size="sm">
          New Topic
        </Button>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold mb-2">Today's Topic:</h3>
        <p className="mb-4">{dailyTopic}</p>
        <Button
          onClick={toggleRecording}
          className={isRecording ? "bg-red-500" : ""}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
        {isRecording && (
          <p className="mt-2">Recording Time: {recordingTime}s</p>
        )}
        <p className="mt-4">
          Aim to speak for 5 minutes on this topic. Listen back to identify
          areas for improvement.
        </p>
      </CardContent>
    </Card>
  );
};

export default SpeakingTab;
