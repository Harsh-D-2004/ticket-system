import User from "../models/User.js";
import bcrypt from "bcrypt";
import Ticket from "../models/Ticket.js";
import { Octokit } from "@octokit/core";
import 'dotenv/config';

export async function registerUser(userData) {
  try {
    const role = userData.role;

    if (role != "customer") {
      throw new Error("Only customers can register themselves.");
    } else {
      const { name, email, password, role } = userData;
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed, role });
      return {
        message: "User registered successfully",
        userId: user._id,
      };
    }
  } catch (err) {
    throw new Error(err.message || "Registration failed");
  }
}


export async function loginUser(userData) {
  try {
    const { email, password } = userData;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid password");
      } else {
        return {
          message: "Login successful",
          userId: user._id,
          role: user.role,
        };
      }
    }
  }catch (err) {
    throw new Error(err.message || "Login failed");
  }
}

const octokit = new Octokit({
  auth: process.env.GITHUB_API_KEY
});

export async function createGitHubIssue({ title, body, owner = process.env.OWNER, repo = process.env.REPO }) {
  try {
    const response = await octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner,
      repo,
      title,
      body,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return {url : response.data.html_url , id : response.data.number};
  } catch (err) {
    console.error("GitHub issue creation failed:", err);
    throw new Error("Failed to create GitHub issue");
  }
}

export async function createTicket(ticketData , userId) {
  try {
    console.log(userId);
    const { title, description, category} = ticketData;
    const ticket = await Ticket.create({ title, description, category , createdBy: userId});
    // const ticket = await Ticket.create({ title, description, category , createdBy: "685256aba70d07bb9f2b85c2"});
    const res = await createGitHubIssue({ title, body: description, owner: "Harsh-D-2004", repo: "support-ticket-test" });
    ticket.githubIssueUrl = res.url;
    ticket.githubIssueId = res.id;
    await ticket.save();
    return {
      message: "Ticket created successfully",
      ticketId: ticket._id,
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function openGithubIssue(issueNumber) {
  try {
    const owner = process.env.OWNER;
    const repo = process.env.REPO;
    await octokit.request('PATCH /repos/Harsh-D-2004/support-ticket-test/issues/{issue_number}', {
      owner,
      repo,
      issue_number: issueNumber,
      state: 'open',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    console.log(`Issue #${issueNumber} opened`);
  } catch (err) {
    console.error(`Failed to open issue #${issueNumber}:`, err);
    throw new Error("Failed to open GitHub issue");
  }
}

export async function closeGithubIssue(issueNumber) {
  try {
    const owner = process.env.OWNER;
    const repo = process.env.REPO;
    await octokit.request('PATCH /repos/Harsh-D-2004/support-ticket-test/issues/{issue_number}', {
      owner,
      repo,
      issue_number: issueNumber,
      state: 'closed',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    console.log(`Issue #${issueNumber} closed`);
  } catch (err) {
    console.error(`Failed to close issue #${issueNumber}:`, err);
    throw new Error("Failed to close GitHub issue");
  }
}


export default {
  registerUser,
  loginUser,
  createTicket,
  openGithubIssue,
  closeGithubIssue
};