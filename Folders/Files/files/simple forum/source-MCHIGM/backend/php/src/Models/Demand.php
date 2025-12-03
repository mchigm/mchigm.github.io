<?php
/**
 * Demand Model - Example implementation
 * 
 * Represents a demand/request in the platform
 */

namespace Mchigm\Models;

class Demand
{
    private string $id;
    private string $title;
    private string $description;
    private string $category;
    private array $tags;
    private string $status;
    private string $userId;
    private string $deadline;
    private string $createdAt;
    private string $updatedAt;

    /**
     * Valid status values
     */
    public const STATUS_OPEN = 'open';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CLOSED = 'closed';

    /**
     * Valid categories
     */
    public const CATEGORIES = [
        'volunteer' => '志愿服务',
        'education' => '教育公益',
        'startup' => '创业招募',
        'campus' => '校园公益',
        'community' => '社区服务',
    ];

    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? $this->generateId();
        $this->title = $data['title'] ?? '';
        $this->description = $data['description'] ?? '';
        $this->category = $data['category'] ?? '';
        $this->tags = $data['tags'] ?? [];
        $this->status = $data['status'] ?? self::STATUS_OPEN;
        $this->userId = $data['user_id'] ?? '';
        $this->deadline = $data['deadline'] ?? '';
        $this->createdAt = $data['created_at'] ?? date('Y-m-d H:i:s');
        $this->updatedAt = $data['updated_at'] ?? date('Y-m-d H:i:s');
    }

    /**
     * Generate unique ID
     */
    private function generateId(): string
    {
        return 'd' . substr(md5(uniqid((string) mt_rand(), true)), 0, 6);
    }

    // Getters
    public function getId(): string
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getCategory(): string
    {
        return $this->category;
    }

    public function getTags(): array
    {
        return $this->tags;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function getUserId(): string
    {
        return $this->userId;
    }

    public function getDeadline(): string
    {
        return $this->deadline;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): string
    {
        return $this->updatedAt;
    }

    // Setters
    public function setTitle(string $title): self
    {
        $this->title = $title;
        $this->updatedAt = date('Y-m-d H:i:s');
        return $this;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;
        $this->updatedAt = date('Y-m-d H:i:s');
        return $this;
    }

    public function setCategory(string $category): self
    {
        $this->category = $category;
        $this->updatedAt = date('Y-m-d H:i:s');
        return $this;
    }

    public function setTags(array $tags): self
    {
        $this->tags = $tags;
        $this->updatedAt = date('Y-m-d H:i:s');
        return $this;
    }

    public function setStatus(string $status): self
    {
        if (!in_array($status, [
            self::STATUS_OPEN, 
            self::STATUS_IN_PROGRESS, 
            self::STATUS_COMPLETED, 
            self::STATUS_CLOSED
        ])) {
            throw new \InvalidArgumentException("Invalid status: $status");
        }
        $this->status = $status;
        $this->updatedAt = date('Y-m-d H:i:s');
        return $this;
    }

    public function setDeadline(string $deadline): self
    {
        $this->deadline = $deadline;
        $this->updatedAt = date('Y-m-d H:i:s');
        return $this;
    }

    /**
     * Check if demand is active
     */
    public function isActive(): bool
    {
        return in_array($this->status, [self::STATUS_OPEN, self::STATUS_IN_PROGRESS]);
    }

    /**
     * Check if demand is overdue
     */
    public function isOverdue(): bool
    {
        if (empty($this->deadline)) {
            return false;
        }
        return strtotime($this->deadline) < time();
    }

    /**
     * Convert to array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'tags' => $this->tags,
            'status' => $this->status,
            'user_id' => $this->userId,
            'deadline' => $this->deadline,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }

    /**
     * Create from array
     */
    public static function fromArray(array $data): self
    {
        return new self($data);
    }
}
