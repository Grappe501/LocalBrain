import {Router} from "express";import {defineTerm,getAutonomousCoach,getLessonExperience} from "../companyFoundry/autonomousCoach.js";export const autonomousCoachRouter=Router();
autonomousCoachRouter.get("/foundry/academy/enrollments/:id/experience",(req,res)=>{const d=getAutonomousCoach(req.params.id);return d?res.json(d):res.status(404).json({error:"academy_enrollment_not_found"});});
autonomousCoachRouter.get("/foundry/academy/lessons/:moduleId/experience",(req,res)=>{const d=getLessonExperience(req.params.moduleId);return d?res.json(d):res.status(404).json({error:"academy_module_not_found"});});
autonomousCoachRouter.get("/foundry/academy/glossary/:term",(req,res)=>{const d=defineTerm(req.params.term);return d?res.json(d):res.status(404).json({error:"term_not_found"});});
