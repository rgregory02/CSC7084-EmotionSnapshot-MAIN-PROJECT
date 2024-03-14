-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Mar 14, 2024 at 06:23 PM
-- Server version: 5.7.39
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `CSC7084ASSIGNMENT`
--

-- --------------------------------------------------------

--
-- Table structure for table `contextual_trigger`
--

CREATE TABLE `contextual_trigger` (
  `contextual_trigger_id` int(11) NOT NULL,
  `contextual_trigger_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `contextual_trigger`
--

INSERT INTO `contextual_trigger` (`contextual_trigger_id`, `contextual_trigger_name`) VALUES
(1, 'Social Interaction'),
(2, 'Physical Activity'),
(3, 'Family'),
(4, 'Work'),
(5, 'Sleep'),
(6, 'Weather');

-- --------------------------------------------------------

--
-- Table structure for table `contextual_trigger_emotional_snapshot`
--

CREATE TABLE `contextual_trigger_emotional_snapshot` (
  `contextual_trigger_emotion_snapshot_id` int(11) NOT NULL,
  `emotion_snapshot_id` int(11) NOT NULL,
  `contextual_trigger_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `emotion_snapshot`
--

CREATE TABLE `emotion_snapshot` (
  `emotion_snapshot_id` int(11) NOT NULL,
  `enjoyment_level` int(2) DEFAULT NULL,
  `sadness_level` int(2) DEFAULT NULL,
  `anger_level` int(2) DEFAULT NULL,
  `contempt_level` int(2) DEFAULT NULL,
  `disgust_level` int(2) DEFAULT NULL,
  `fear_level` int(2) DEFAULT NULL,
  `surprise_level` int(2) DEFAULT NULL,
  `list_contextual_trigger` varchar(255) DEFAULT NULL,
  `contextual_trigger` text,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `emotion_snapshot`
--

INSERT INTO `emotion_snapshot` (`emotion_snapshot_id`, `enjoyment_level`, `sadness_level`, `anger_level`, `contempt_level`, `disgust_level`, `fear_level`, `surprise_level`, `list_contextual_trigger`, `contextual_trigger`, `timestamp`, `user_id`) VALUES
(200, 3, 3, 3, 3, 3, 3, 3, 'Family, Work', 'Please work again', '2024-02-22 00:00:00', 18),
(203, 2, 8, 1, 4, 2, 8, 5, 'Social Interaction', 'The movie we watched was scary and I am worried I will have nightmares', '2024-06-17 15:07:00', 18),
(207, 3, 3, 9, 2, 8, 2, 5, 'Work', 'Start of the work week - Mondays are not fun!', '2024-04-01 20:49:00', 18),
(209, 9, 2, 4, 1, 4, 4, 1, 'Social Interaction, Weather', 'Had a lot of fun with friends even though it was raining', '2024-02-03 01:00:00', 18),
(210, 8, 5, 2, 3, 2, 4, 9, 'Physical Activity, Sleep', 'Slept well and enjoyed my gym session which I wasn\'t expecting!', '2024-03-31 22:44:00', 18),
(212, 8, 2, 3, 0, 0, 2, 7, 'Social Interaction, Family, Weather', 'It is lovely and sunny today', '2024-03-13 13:02:00', 18),
(213, 9, 0, 1, 1, 0, 7, 7, 'Physical Activity, Work', 'Busiest work day of the year!', '2023-12-24 15:02:00', 60),
(214, 9, 1, 2, 1, 2, 1, 9, 'Social Interaction, Sleep, Weather', 'Enjoying a holiday after a busy few weeks in work', '2024-01-15 15:03:00', 60),
(215, 2, 2, 3, 2, 2, 9, 8, 'Social Interaction, Sleep, Work', 'Not sure if I will get all my work done in time!', '2023-12-19 15:03:00', 60),
(216, 1, 8, 6, 7, 8, 2, 1, NULL, 'I split hot cocoa over my work uniform', '2023-12-25 15:04:00', 60),
(220, 2, 4, 3, 2, 9, 7, 8, NULL, 'It is lovely and sunny today - yay!', '2024-02-22 00:37:00', 18),
(221, 8, 2, 8, 3, 5, 8, 5, 'Social Interaction, Weather', 'Had a lot of fun with friends even though it was raining', '2024-03-14 00:14:00', 18),
(222, 4, 4, 4, 4, 4, 4, 4, NULL, 'I hope this works', '2024-02-03 00:00:00', 18),
(223, 4, 4, 4, 4, 4, 4, 4, NULL, 'I hope this works', '2024-02-03 00:00:00', 18);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `first_name`, `last_name`, `user_name`, `user_password`, `user_type_id`) VALUES
(18, 'EasterBunny', 'BunnyRabbit', 'eb123', '$2b$12$76Ux89AmnccQ0Im1U2ItUOvmdoKxf9UJSXT5no4NY2w5xweWa9Gm6', 1),
(19, 'Mary', 'Poppins', 'marypoppins456', '$2b$12$44TYA2g4UTqUeifDP5qqjehg8RmfsN3h1zNc5GGbI89o0b4mSbX.e', 1),
(25, 'Harry', 'Potter', 'harrypotter', '$2b$12$6gGwH70AsIpEFDGwBxI7FOkb9ph4Lz8ke90ItDj9Lcs4xfiT4zrf6', 1),
(60, 'Santa', 'Claus', 'sc123', '$2b$12$BItQdEnyPT6PPqCxGLwTauSq87Qeo0MQvbbIzXmSvwYMUheFaB.Aa', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_type`
--

CREATE TABLE `user_type` (
  `user_type_id` int(11) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_type`
--

INSERT INTO `user_type` (`user_type_id`, `role`) VALUES
(1, 'user'),
(2, 'administrator');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contextual_trigger`
--
ALTER TABLE `contextual_trigger`
  ADD PRIMARY KEY (`contextual_trigger_id`);

--
-- Indexes for table `contextual_trigger_emotional_snapshot`
--
ALTER TABLE `contextual_trigger_emotional_snapshot`
  ADD PRIMARY KEY (`contextual_trigger_emotion_snapshot_id`),
  ADD KEY `contextual_trigger_emotion_snapshot_contextual_trigger_id` (`contextual_trigger_id`),
  ADD KEY `ontextual_trigger_emotion_snapshot_emotion_snapshot_id` (`emotion_snapshot_id`);

--
-- Indexes for table `emotion_snapshot`
--
ALTER TABLE `emotion_snapshot`
  ADD PRIMARY KEY (`emotion_snapshot_id`),
  ADD KEY `user_user_id` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_name` (`user_name`),
  ADD UNIQUE KEY `user_name_2` (`user_name`),
  ADD KEY `user_type_id_user_type` (`user_type_id`);

--
-- Indexes for table `user_type`
--
ALTER TABLE `user_type`
  ADD PRIMARY KEY (`user_type_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contextual_trigger`
--
ALTER TABLE `contextual_trigger`
  MODIFY `contextual_trigger_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `contextual_trigger_emotional_snapshot`
--
ALTER TABLE `contextual_trigger_emotional_snapshot`
  MODIFY `contextual_trigger_emotion_snapshot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=216;

--
-- AUTO_INCREMENT for table `emotion_snapshot`
--
ALTER TABLE `emotion_snapshot`
  MODIFY `emotion_snapshot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=224;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `user_type`
--
ALTER TABLE `user_type`
  MODIFY `user_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contextual_trigger_emotional_snapshot`
--
ALTER TABLE `contextual_trigger_emotional_snapshot`
  ADD CONSTRAINT `contextual_trigger_emotion_snapshot_contextual_trigger_id` FOREIGN KEY (`contextual_trigger_id`) REFERENCES `contextual_trigger` (`contextual_trigger_id`),
  ADD CONSTRAINT `ontextual_trigger_emotion_snapshot_emotion_snapshot_id` FOREIGN KEY (`emotion_snapshot_id`) REFERENCES `emotion_snapshot` (`emotion_snapshot_id`);

--
-- Constraints for table `emotion_snapshot`
--
ALTER TABLE `emotion_snapshot`
  ADD CONSTRAINT `user_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_type_id_user_type` FOREIGN KEY (`user_type_id`) REFERENCES `user_type` (`user_type_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
